import type { Metadata } from "next";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { EmptyState } from "@/components/ui/States";
import { getSavedIds, getSavedListings } from "@/lib/listings";

export const metadata: Metadata = { title: "Saved parts" };
export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const [listings, ids] = await Promise.all([getSavedListings(), getSavedIds()]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink-900">Saved parts</h1>
      <p className="mt-1 text-sm text-ink-500">Listings you&rsquo;ve hearted, so you can find them again.</p>
      <div className="mt-8">
        {listings.length > 0 ? (
          <ListingGrid listings={listings} savedIds={ids} />
        ) : (
          <EmptyState
            title="Nothing saved yet"
            description="Tap the heart on any listing to keep it here."
            actionHref="/browse"
            actionLabel="Browse parts"
          />
        )}
      </div>
    </div>
  );
}
