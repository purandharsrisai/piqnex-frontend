"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListingImagePlaceholder } from "@/components/listings/ListingImagePlaceholder";
import { formatPrice, formatDate } from "@/lib/utils";
import { adminSetListingStatusAction } from "@/lib/actions/admin";
import type { AdminListingRow as AdminListingRowData } from "@/lib/admin-data";

const STATUS_TONE = {
  active: "moss",
  sold: "neutral",
  removed: "warning",
} as const;

export function AdminListingRow({ listing }: { listing: AdminListingRowData }) {
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
        <Link href={`/parts/${listing.id}`} className="truncate text-sm font-semibold text-ink-900 hover:underline">
          {listing.brand} {listing.product} - {listing.part}
        </Link>
        <p className="text-xs text-ink-500">
          Seller: {listing.sellerName} &middot; Listed {formatDate(listing.createdAt)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{formatPrice(listing.price)}</span>
          <Badge tone={STATUS_TONE[listing.status]}>{listing.status}</Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {listing.status !== "removed" ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => {
              if (confirm("Remove this listing? It will be hidden from Browse, but can be reactivated later.")) {
                startTransition(() => adminSetListingStatusAction(listing.id, "removed"));
              }
            }}
            title="Remove listing"
          >
            <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => adminSetListingStatusAction(listing.id, "active"))}
            title="Reactivate"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Card>
  );
}
