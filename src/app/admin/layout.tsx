import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-client";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Page-level gate for the whole /admin area. Server Actions in
 * lib/actions/admin.ts independently re-check isAdmin too (every
 * AdminController route requires JwtAuthGuard + AdminGuard) - this layout
 * is what keeps a non-admin from ever seeing the admin UI in the first
 * place. src/middleware.ts also redirects non-admins away from /admin as
 * an earlier, cheaper gate - this is the authoritative one.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login?redirectTo=/admin");
  if (!user.isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl text-ink-900">Admin</h1>
      <p className="mt-1 text-sm text-ink-500">
        Moderate listings and need requests, view users, and manage the catalog.
      </p>
      <div className="mt-6">
        <AdminNav />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
