import { LinkButton } from "@/components/ui/Button";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { getHomepageListings } from "@/lib/listings";

export async function FeaturedListings() {
  const listings = await getHomepageListings(8);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink-900">Recently listed</h2>
          <p className="mt-1 text-ink-500">A few of the pieces people are looking to pass on.</p>
        </div>
        <LinkButton href="/browse" variant="outline" size="sm" className="hidden sm:inline-flex">
          View all
        </LinkButton>
      </div>
      <div className="mt-6">
        <ListingGrid listings={listings} />
      </div>
      <div className="mt-6 text-center sm:hidden">
        <LinkButton href="/browse" variant="outline" size="sm">
          View all listings
        </LinkButton>
      </div>
    </section>
  );
}
