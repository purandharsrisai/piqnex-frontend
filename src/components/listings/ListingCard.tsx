import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
    <Link
      href={`/parts/${listing.id}`}
      className="group block focus-visible:outline-none"
    >
      <Card
        className={`overflow-hidden transition-shadow group-hover:shadow-card-hover group-focus-visible:shadow-card-hover ${
          listing.isSample ? "border-dashed" : ""
        }`}
      >
        <div className="relative aspect-[4/3] w-full bg-ink-100">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={`${listing.brand} ${listing.product} - ${listing.part}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <ListingImagePlaceholder label={listing.part} />
          )}
          <Badge tone={conditionTone[listing.condition]} className="absolute left-2 top-2 bg-paper/95">
            {listing.condition}
          </Badge>
        </div>
        {/* The part is the product here - it leads. Brand/model is context
            underneath, not the headline, which is the opposite of a normal
            e-commerce card and is the whole point of this marketplace. */}
        <div className="flex flex-col gap-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[15px] font-semibold leading-snug text-ink-900">
              {listing.part}
            </p>
            {listing.isSample && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Sample
              </span>
            )}
          </div>
          <p className="truncate text-xs text-ink-500">
            {listing.brand} {listing.product}
            {listing.model ? ` · ${listing.model}` : ""}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="font-display text-lg text-ink-900">
              {formatPrice(listing.price)}
            </span>
            {listing.location && (
              <span className="flex items-center gap-1 truncate text-xs text-ink-400">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{listing.location}</span>
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
