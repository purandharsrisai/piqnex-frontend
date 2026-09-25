import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { getAdminOverviewCounts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const counts = await getAdminOverviewCounts();

  const stats = [
    { label: "Total listings", value: counts.totalListings },
    { label: "Active listings", value: counts.activeListings },
    { label: "Open need requests", value: counts.openNeedRequests },
    { label: "Users", value: counts.totalUsers },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-5">
          <p className="text-sm text-ink-500">{stat.label}</p>
          <p className="mt-1 font-display text-3xl text-ink-900">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
