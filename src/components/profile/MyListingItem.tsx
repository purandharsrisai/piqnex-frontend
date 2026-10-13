"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, CheckCircle2, RotateCcw, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListingImagePlaceholder } from "@/components/listings/ListingImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import { deleteListingAction, updateListingStatusAction } from "@/lib/actions/listings";
import type { MyListing } from "@/lib/profile-data";

export function MyListingItem({ listing }: { listing: MyListing }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="flex flex-col gap-4 rounded-2xl p-4 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center">
      <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:w-24">
        {listing.imageUrl ? (
          <Image src={listing.imageUrl} alt={listing.part} fill sizes="96px" className="object-cover" />
        ) : (
          <ListingImagePlaceholder label={listing.part} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-ink-900">{listing.part}</p>
        <p className="truncate text-sm text-ink-500">
          {listing.brand} {listing.product}
          {listing.model ? ` · ${listing.model}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-display text-lg text-ink-900">{formatPrice(listing.price)}</span>
          <Badge tone={listing.status === "active" ? "moss" : listing.status === "sold" ? "neutral" : "warning"}>
            {listing.status}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        <Link
          href={`/parts/${listing.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100"
          title="Edit"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
        </Link>
        {listing.status !== "sold" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => updateListingStatusAction(listing.id, "sold"))}
            title="Mark as sold"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Sold
          </Button>
        )}
        {listing.status !== "active" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => updateListingStatusAction(listing.id, "active"))}
            title="Reactivate"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Relist
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this listing? This can't be undone.")) {
              startTransition(() => deleteListingAction(listing.id));
            }
          }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" /> <span className="sr-only">Delete</span>
        </Button>
      </div>
    </Card>
  );
}
