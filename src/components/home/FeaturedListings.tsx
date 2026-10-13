import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Reveal } from "@/components/ui/Reveal";
import { getHomepageListings } from "@/lib/listings";

export async function FeaturedListings() {
  const listings = await getHomepageListings(8);

  return (
    <section className="bg-ink-50/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-clay-600">Just added</p>
              <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">Fresh listings</h2>
              <p className="mt-2 text-ink-500">Spare pieces people are looking to pass on.</p>
            </div>
            <LinkButton
              href="/browse"
              variant="outline"
              size="md"
              className="group hidden shrink-0 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </LinkButton>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="mt-8">
          {listings.length > 0 ? (
            <ListingGrid listings={listings} />
          ) : (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
              <p className="font-display text-xl text-ink-900">No parts listed yet</p>
              <p className="mt-1 text-sm text-ink-500">Be the first - got a spare piece someone might need?</p>
              <LinkButton href="/sell" className="mt-4">List a part</LinkButton>
            </div>
          )}
        </Reveal>
        <div className="mt-8 text-center sm:hidden">
          <LinkButton href="/browse" variant="outline" size="md">
            View all listings
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
