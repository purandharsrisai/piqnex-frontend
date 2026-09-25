import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ContactSellerForm } from "@/components/listings/ContactSellerForm";
import { ListingImagePlaceholder } from "@/components/listings/ListingImagePlaceholder";
import { getListingDetail } from "@/lib/listings";
import { getOpenNeedRequestMatches } from "@/lib/need-requests";
import { formatPrice, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListingDetail(params.id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: `${listing.brand} ${listing.product} - ${listing.part}`,
    description: listing.description.slice(0, 155),
  };
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const listing = await getListingDetail(params.id);
  if (!listing) notFound();

  const justCreated = searchParams.created === "1";
  const needMatches = justCreated
    ? await getOpenNeedRequestMatches({
        brand: listing.brand,
        product: listing.product,
        model: listing.model,
        part: listing.part,
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {justCreated && (
        <Card className="mb-6 border-moss-200 bg-moss-50 p-5 text-moss-900">
          <p className="font-semibold">Your part is now listed!</p>
          {needMatches.length > 0 ? (
            <p className="mt-1 text-sm">
              {needMatches.length} {needMatches.length === 1 ? "person is" : "people are"} looking
              for exactly this part. Check your messages soon.
            </p>
          ) : (
            <p className="mt-1 text-sm">
              We&rsquo;ll show it to buyers searching for this exact brand, product, and part.
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-50">
            {listing.images[0] ? (
              <Image
                src={listing.images[0]}
                alt={`${listing.brand} ${listing.product} - ${listing.part}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <ListingImagePlaceholder label={listing.part} />
            )}
            {listing.isSample && (
              <Badge tone="sample" className="absolute left-3 top-3 bg-white">
                Sample listing
              </Badge>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {listing.images.slice(1, 6).map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-ink-50">
                  <Image src={src} alt={`Additional photo ${i + 2}`} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-ink-700">{listing.description}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-medium text-clay-600">
            {listing.brand} {listing.product}
            {listing.model ? ` (${listing.model})` : ""}
          </p>
          <h1 className="mt-1 font-display text-2xl text-ink-900">{listing.part}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="clay">{listing.condition}</Badge>
            {listing.location && (
              <span className="flex items-center gap-1 text-sm text-ink-500">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {listing.location}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-ink-400">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Listed {formatDate(listing.createdAt)}
            </span>
          </div>

          <p className="mt-5 font-display text-3xl text-ink-900">
            {formatPrice(listing.price, listing.currency)}
          </p>

          <Card className="mt-6 flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700">
              {(listing.seller?.displayName ?? "S")[0]?.toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {listing.isSample ? "Sample Seller" : listing.seller?.displayName ?? "Marketplace Seller"}
              </p>
              <p className="flex items-center gap-1 text-xs text-ink-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Member of Piqnex
              </p>
            </div>
          </Card>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ink-900">Contact Seller</h2>
            <p className="mt-1 text-xs text-ink-500">Does this match your product? Send a quick message.</p>
            <div className="mt-3">
              {listing.isSample ? (
                <Card className="p-4 text-sm text-ink-500">
                  This is sample data for demo purposes - there&rsquo;s no real seller to contact.
                  Try a real listing from <a href="/browse" className="text-clay-600 underline">Browse Parts</a>.
                </Card>
              ) : (
                <ContactSellerForm listingId={listing.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
