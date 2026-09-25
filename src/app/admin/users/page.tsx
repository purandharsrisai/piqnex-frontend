import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import { getAllUsersForAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin - Users" };

export default async function AdminUsersPage() {
  const users = await getAllUsersForAdmin();

  if (users.length === 0) {
    return <EmptyState title="No users yet" description="Signed-up accounts will show up here." />;
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
            <th className="px-4 py-3 font-semibold">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-ink-50 last:border-0">
              <td className="px-4 py-3 font-medium text-ink-900">{user.displayName}</td>
              <td className="px-4 py-3 text-ink-600">{user.email ?? "-"}</td>
              <td className="px-4 py-3 text-ink-600">{user.location ?? "-"}</td>
              <td className="px-4 py-3 text-ink-600">{formatDate(user.createdAt)}</td>
              <td className="px-4 py-3">
                {user.isAdmin ? <Badge tone="clay">Admin</Badge> : <Badge tone="neutral">Member</Badge>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
