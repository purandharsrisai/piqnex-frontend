import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card } from "@/components/ui/Card";

/**
 * Page-level gate for the whole /admin area. Server Actions in
 * lib/actions/admin.ts independently re-check is_admin too (see
 * requireAdmin there) - this layout is what keeps a non-admin from ever
 * seeing the admin UI in the first place.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <Card className="p-6">
          <h1 className="font-display text-xl text-ink-900">Supabase isn&rsquo;t connected yet</h1>
          <p className="mt-2 text-sm text-ink-500">
            The admin area needs a configured Supabase project. Add your credentials to{" "}
            <code>.env.local</code> and restart the dev server.
          </p>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/");

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
