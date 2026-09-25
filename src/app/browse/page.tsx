import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrowseFilters } from "@/components/listings/BrowseFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { EmptyState } from "@/components/ui/States";
import { Badge } from "@/components/ui/Badge";
import { searchListings } from "@/lib/listings";
import type { ConditionOption } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Parts",
  description: "Search and filter individual replacement parts and components by brand, product, model, and condition.",
};

const PAGE_SIZE = 12;

function param(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || "";
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = param(searchParams, "q");
  const category = param(searchParams, "category");
  const brand = param(searchParams, "brand");
  const product = param(searchParams, "product");
  const model = param(searchParams, "model");
  const part = param(searchParams, "part");
  const condition = param(searchParams, "condition") as ConditionOption | "";
  const location = param(searchParams, "location");
  const minPriceRaw = param(searchParams, "minPrice");
  const maxPriceRaw = param(searchParams, "maxPrice");
  const page = Math.max(1, Number(param(searchParams, "page")) || 1);

  const result = await searchListings({
    q: q || undefined,
    category: category || undefined,
    brand: brand || undefined,
    product: product || undefined,
    model: model || undefined,
    part: part || undefined,
    condition: condition || undefined,
    location: location || undefined,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ q, category, brand, product, model, part, condition, location, minPriceRaw, maxPriceRaw })
        .filter(([, v]) => v)
    )
  );

  function pageHref(p: number) {
    const params = new URLSearchParams(query);
    params.set("page", String(p));
    return `/browse?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink-900">Browse Parts</h1>
        <p className="mt-1 text-ink-500">Find the exact component you need.</p>
      </div>

      <BrowseFilters
        defaults={{
          q,
          category,
          brand,
          product,
          model,
          part,
          condition,
          minPrice: minPriceRaw,
          maxPrice: maxPriceRaw,
          location,
        }}
      />

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <p className="text-sm text-ink-500">
            {result.total} {result.total === 1 ? "listing" : "listings"} found
          </p>
          {result.usingSampleData && <Badge tone="sample">Showing sample listings</Badge>}
        </div>

        {result.listings.length > 0 ? (
          <ListingGrid listings={result.listings} />
        ) : (
          <EmptyState
            title="No listings match your filters"
            description="Try widening your search, or create a need request so sellers know there's demand for this part."
            actionHref="/need"
            actionLabel="Create a Need Request"
          />
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-2"
          >
            <Link
              href={pageHref(Math.max(1, page - 1))}
              aria-disabled={page === 1}
              className={`flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-2 text-sm ${
                page === 1 ? "pointer-events-none opacity-40" : "hover:bg-ink-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Link>
            <span className="text-sm text-ink-500">
              Page {page} of {totalPages}
            </span>
            <Link
              href={pageHref(Math.min(totalPages, page + 1))}
              aria-disabled={page === totalPages}
              className={`flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-2 text-sm ${
                page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-ink-50"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
