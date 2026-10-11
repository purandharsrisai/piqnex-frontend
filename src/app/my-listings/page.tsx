import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { getMyListings } from "@/lib/profile-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { MyListingItem } from "@/components/profile/MyListingItem";

export const metadata: Metadata = { title: "My Listings" };

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/my-listings");

  const listings = await getMyListings();

  return (
    <div>
      <PageHeader eyebrow="Account" title="My listings" subtitle="Parts you're offering to others.">
        <LinkButton href="/sell" size="md" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> New listing
        </LinkButton>
      </PageHeader>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {listings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {listings.map((l) => (
              <MyListingItem key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven't listed anything yet"
            description="Have a spare part sitting around? List it and someone might need exactly that."
            actionHref="/sell"
            actionLabel="Create a listing"
          />
        )}
      </div>
    </div>
  );
}
