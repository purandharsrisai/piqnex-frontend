"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Trash2, CheckCircle2, RotateCcw } from "lucide-react";
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
    <Card className="flex items-center gap-4 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-50">
        {listing.imageUrl ? (
          <Image src={listing.imageUrl} alt={listing.part} fill sizes="64px" className="object-cover" />
        ) : (
          <ListingImagePlaceholder label={listing.part} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">
          {listing.brand} {listing.product} - {listing.part}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{formatPrice(listing.price)}</span>
          <Badge tone={listing.status === "active" ? "moss" : listing.status === "sold" ? "neutral" : "warning"}>
            {listing.status}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {listing.status !== "sold" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => updateListingStatusAction(listing.id, "sold"))}
            title="Mark as sold"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
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
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
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
          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
