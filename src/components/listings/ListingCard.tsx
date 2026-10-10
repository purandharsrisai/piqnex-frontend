import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ListingImagePlaceholder } from "./ListingImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import type { ConditionOption } from "@/lib/types";

/**
 * Normalized shape both real Supabase listings and dev sample listings can
 * be mapped into, so ListingCard doesn't need to know which one it's given.
 */
export interface ListingCardData {
  id: string;
  imageUrl: string | null;
  brand: string;
  product: string;
  model?: string | null;
  part: string;
  condition: ConditionOption;
  price: number;
  location?: string | null;
  isSample?: boolean;
}

const conditionTone: Record<ConditionOption, "moss" | "clay" | "neutral" | "warning"> = {
  New: "moss",
  "Like New": "moss",
  "Used - Working": "clay",
  "Used - Good": "clay",
  "Used - Fair": "warning",
  "For Parts": "neutral",
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link href={`/parts/${listing.id}`} className="group block focus-visible:outline-none">
      <article className="transition-transform duration-200 group-hover:-translate-y-1">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-100 shadow-card transition-shadow duration-200 group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-clay-600 ${
            listing.isSample ? "ring-1 ring-inset ring-ink-200" : ""
          }`}
        >
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={`${listing.brand} ${listing.product} - ${listing.part}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ListingImagePlaceholder
              label={listing.part}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <Badge
            tone={conditionTone[listing.condition]}
            className="absolute left-3 top-3 bg-white shadow-card"
          >
            {listing.condition}
          </Badge>
          {listing.isSample && (
            <span className="absolute bottom-3 right-3 rounded-full bg-ink-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
              Sample
            </span>
          )}
        </div>
        {/* The part is the product here - it leads; brand/model is context. */}
        <div className="px-1 pt-3.5">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <p className="order-2 truncate text-base font-bold leading-snug text-ink-900 sm:order-1">{listing.part}</p>
            <span className="order-1 shrink-0 font-display text-lg leading-snug text-ink-900 sm:order-2">
              {formatPrice(listing.price)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-ink-500">
            {listing.brand} {listing.product}
            {listing.model ? ` · ${listing.model}` : ""}
          </p>
          {listing.location && (
            <p className="mt-2 flex items-center gap-1 truncate text-xs font-medium text-ink-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-clay-600" aria-hidden="true" />
              <span className="truncate">{listing.location}</span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
