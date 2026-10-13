import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ListingImagePlaceholder } from "@/components/listings/ListingImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import type { ConversationThread } from "@/lib/messages";

/** Right-hand panel: the part being discussed and, when they're the seller, the other person's rating. */
export function PartPanel({
  thread,
  rating,
}: {
  thread: ConversationThread;
  rating: { average: number | null; count: number } | null;
}) {
  const { listing } = thread;
  const inactive = listing.status !== "active";
  const facts: [string, React.ReactNode][] = [
    ["Price", <b key="p">{formatPrice(Number(listing.price), listing.currency)}</b>],
    ["Condition", <b key="c">{listing.condition}</b>],
    [
      "Status",
      <span
        key="s"
        className={`rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ${inactive ? "bg-ink-100 text-ink-600" : "bg-moss-100 text-moss-700"}`}
      >
        {listing.status}
      </span>,
    ],
  ];
  if (listing.location) facts.push(["Location", <b key="l">{listing.location}</b>]);
  if (rating)
    facts.push([
      "Seller rating",
      rating.count > 0 && rating.average !== null ? (
        <b key="r" className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-clay-500 text-clay-500" aria-hidden="true" />
          {rating.average.toFixed(1)} <span className="font-normal text-ink-500">({rating.count})</span>
        </b>
      ) : (
        <span key="r" className="text-ink-500">No reviews yet</span>
      ),
    ]);

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-50">
        {listing.imageUrl ? (
          <Image src={listing.imageUrl} alt="" fill sizes="260px" className="object-cover" />
        ) : (
          <ListingImagePlaceholder label={listing.partName} />
        )}
      </div>
      <div>
        <p className="font-semibold text-ink-900">
          {listing.brandName} {listing.productName} - {listing.partName}
        </p>
        <p className="text-xs text-ink-500">
          {listing.brandName} · {listing.productName}
          {listing.modelLabel ? ` · ${listing.modelLabel}` : ""}
        </p>
      </div>
      <dl className="text-sm">
        {facts.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 border-b border-dashed border-ink-100 py-2">
            <dt className="text-ink-500">{label}</dt>
            <dd className="text-right text-ink-900">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        href={`/parts/${listing.id}`}
        className="rounded-xl bg-clay-600 px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-clay-700"
      >
        View listing
      </Link>
    </div>
  );
}
