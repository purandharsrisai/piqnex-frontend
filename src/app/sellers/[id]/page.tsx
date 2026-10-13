import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, PackageCheck } from "lucide-react";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { Stars } from "@/components/reviews/Stars";
import { getSellerProfile } from "@/lib/reviews";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getSellerProfile(params.id);
  return { title: data ? `${data.seller.displayName} - seller` : "Seller not found" };
}

export default async function SellerPage({ params }: { params: { id: string } }) {
  const data = await getSellerProfile(params.id);
  if (!data) notFound();
  const { seller, rating, reviews, listings, soldCount } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-pop sm:flex-row sm:items-center">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-clay-600 font-display text-3xl text-white">
          {seller.displayName[0]?.toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-3xl text-ink-900">{seller.displayName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
            {rating.count > 0 && rating.average !== null ? (
              <span className="flex items-center gap-1.5" data-testid="seller-rating">
                <Stars value={rating.average} />
                <strong className="text-ink-900">{rating.average}</strong> ({rating.count} {rating.count === 1 ? "review" : "reviews"})
              </span>
            ) : (
              <span>No reviews yet</span>
            )}
            {seller.location && (
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden="true" />{seller.location}</span>
            )}
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" aria-hidden="true" />Member since {formatDate(seller.createdAt)}</span>
            {soldCount > 0 && (
              <span className="flex items-center gap-1"><PackageCheck className="h-4 w-4" aria-hidden="true" />{soldCount} sold</span>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink-900">Parts for sale</h2>
        <div className="mt-4">
          {listings.length > 0 ? (
            <ListingGrid listings={listings} />
          ) : (
            <p className="text-sm text-ink-500">No active listings right now.</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">Buyers can leave a review after messaging the seller about a part.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3" data-testid="review-list">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Stars value={r.rating} />
                    <span className="text-sm font-semibold text-ink-900">{r.reviewer.displayName}</span>
                  </span>
                  <span className="text-xs text-ink-400">{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && <p className="mt-2 whitespace-pre-line text-[15px] text-ink-700">{r.comment}</p>}
                <Link href={`/parts/${r.listing.id}`} className="mt-2 inline-block text-xs font-semibold text-clay-600 hover:underline">
                  About: {r.listing.partName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
