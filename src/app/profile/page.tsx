import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMyListings, getMyNeedRequests } from "@/lib/profile-data";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { MyListingItem } from "@/components/profile/MyListingItem";
import { MyNeedRequestItem } from "@/components/profile/MyNeedRequestItem";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <Card className="p-6">
          <h1 className="font-display text-xl text-ink-900">Supabase isn&rsquo;t connected yet</h1>
          <p className="mt-2 text-sm text-ink-500">
            Accounts and profiles need a Supabase project. Copy <code>.env.example</code> to{" "}
            <code>.env.local</code>, add your project URL and anon key, then restart the dev server.
          </p>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, location, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const [listings, needRequests] = await Promise.all([
    getMyListings(user.id),
    getMyNeedRequests(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink-900">
            {profile?.display_name ?? "My Profile"}
          </h1>
          <p className="text-sm text-ink-500">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <Card className="mt-6 p-5">
        <h2 className="text-sm font-semibold text-ink-900">Account details</h2>
        <div className="mt-3">
          <ProfileForm displayName={profile?.display_name ?? ""} location={profile?.location ?? null} />
        </div>
      </Card>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">My Listings</h2>
          <LinkButton href="/sell" size="sm" variant="outline">
            + New Listing
          </LinkButton>
        </div>
        {listings.length > 0 ? (
          <div className="flex flex-col gap-2">
            {listings.map((l) => (
              <MyListingItem key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven't listed anything yet"
            description="Have a spare part sitting around? List it and someone might need exactly that."
            actionHref="/sell"
            actionLabel="Create a Listing"
          />
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">My Need Requests</h2>
          <Link href="/need" className="text-sm font-medium text-clay-600 hover:underline">
            + New Request
          </Link>
        </div>
        {needRequests.length > 0 ? (
          <div className="flex flex-col gap-2">
            {needRequests.map((r) => (
              <MyNeedRequestItem key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No need requests yet"
            description="Search for a missing part and save a request if nobody has it listed yet."
            actionHref="/need"
            actionLabel="Find a Part"
          />
        )}
      </section>
    </div>
  );
}
