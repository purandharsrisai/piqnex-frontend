import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { BrowseFilters } from "@/components/listings/BrowseFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { EmptyState } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterPanel } from "@/components/listings/FilterPanel";
import { CATEGORIES } from "@/lib/categories";
import { getSavedIds, searchListings } from "@/lib/listings";
import { getCurrentUser } from "@/lib/api-client";
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
  const sortRaw = param(searchParams, "sort");
  const sort = (["price_asc", "price_desc"].includes(sortRaw) ? sortRaw : "newest") as "newest" | "price_asc" | "price_desc";
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
    sort,
    page,
  });
  const savedIds = (await getCurrentUser()) ? await getSavedIds() : undefined;

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  // Everything currently in the URL (except the page number) - used to build links.
  const current: Record<string, string> = Object.fromEntries(
    Object.entries({
      q,
      category,
      brand,
      product,
      model,
      part,
      condition,
      location,
      minPrice: minPriceRaw,
      maxPrice: maxPriceRaw,
      sort: sort === "newest" ? "" : sort,
    }).filter(([, v]) => v)
  );

  /** A /browse link with some params changed (empty string removes a param). Always resets to page 1 unless `page` is given. */
  function hrefWith(changes: Record<string, string>, pageNumber?: number) {
    const params = new URLSearchParams({ ...current, ...changes });
    for (const [key, value] of [...params.entries()]) if (!value) params.delete(key);
    if (pageNumber && pageNumber > 1) params.set("page", String(pageNumber));
    const qs = params.toString();
    return qs ? `/browse?${qs}` : "/browse";
  }

  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name ?? category;
  const activeFilters = [
    { key: "category", label: "Category", value: categoryName },
    { key: "brand", label: "Brand", value: brand },
    { key: "product", label: "Product", value: product },
    { key: "model", label: "Model", value: model },
    { key: "part", label: "Part", value: part },
    { key: "condition", label: "Condition", value: condition },
    { key: "location", label: "Location", value: location },
    { key: "minPrice", label: "Min", value: minPriceRaw ? `\u20B9${minPriceRaw}` : "" },
    { key: "maxPrice", label: "Max", value: maxPriceRaw ? `\u20B9${maxPriceRaw}` : "" },
  ].filter((f) => f.value);
  const activeCount = activeFilters.length;

  // Page numbers to show: first, last, and a window around the current page.
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  const pillBase = "rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors";

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title="Browse parts"
        subtitle="Find the exact component you need - search by brand, product or part."
      >
        <form action="/browse" method="GET" className="max-w-2xl">
          {/* keep the current filters when the search text changes */}
          {Object.entries(current)
            .filter(([key]) => key !== "q")
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 shadow-card focus-within:border-clay-500 focus-within:ring-4 focus-within:ring-clay-100">
            <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
            <label htmlFor="browse-q" className="sr-only">
              Search parts
            </label>
            <input
              id="browse-q"
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search brand, product, or part..."
              className="w-full border-none bg-transparent text-[15px] focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="rounded-full bg-clay-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-clay-700"
            >
              Search
            </button>
          </div>
        </form>

        <nav aria-label="Categories" className="mt-5 flex flex-wrap gap-2">
          <Link
            href={hrefWith({ category: "" })}
            className={`${pillBase} ${
              !category ? "border-clay-600 bg-clay-600 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={hrefWith({ category: c.slug })}
              className={`${pillBase} ${
                category === c.slug
                  ? "border-clay-600 bg-clay-600 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-8 lg:py-10">
        <div className="lg:sticky lg:top-24">
          <FilterPanel activeCount={activeCount}>
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
                sort,
              }}
            />
          </FilterPanel>
        </div>

        <section aria-label="Results" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm font-semibold text-ink-900">
              {result.total} {result.total === 1 ? "listing" : "listings"} found
              {q && (
                <span className="font-normal text-ink-500">
                  {" "}
                  for &ldquo;{q}&rdquo;
                </span>
              )}
            </p>
            {activeFilters.map((f) => (
              <Link
                key={f.key}
                href={hrefWith({ [f.key]: "" })}
                aria-label={`Remove filter ${f.label}: ${f.value}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-clay-50 px-3 py-1 text-sm font-medium text-clay-700 ring-1 ring-clay-200 transition-colors hover:bg-clay-100"
              >
                {f.label}: {f.value}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
            {(activeCount > 0 || q) && (
              <Link href="/browse" className="text-sm font-medium text-ink-500 underline-offset-2 hover:underline">
                Clear all
              </Link>
            )}
          </div>

          {result.listings.length > 0 ? (
            <ListingGrid listings={result.listings} savedIds={savedIds} threeColumns />
          ) : (
            <EmptyState
              title="No listings match your filters"
              description="Try widening your search, or create a need request so sellers know there's demand for this part."
              actionHref="/need"
              actionLabel="Create a Need Request"
            />
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={hrefWith({}, Math.max(1, page - 1))}
                aria-disabled={page === 1}
                className={`flex items-center gap-1 rounded-full border-2 border-ink-200 px-4 py-2 text-sm font-semibold ${
                  page === 1 ? "pointer-events-none opacity-40" : "hover:border-ink-900"
                }`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </Link>
              {pageNumbers.map((n, i) => (
                <span key={n} className="flex items-center gap-2">
                  {i > 0 && n - pageNumbers[i - 1] > 1 && <span className="text-ink-400">&hellip;</span>}
                  <Link
                    href={hrefWith({}, n)}
                    aria-current={n === page ? "page" : undefined}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold ${
                      n === page ? "bg-clay-600 text-white" : "text-ink-700 hover:bg-ink-100"
                    }`}
                  >
                    {n}
                  </Link>
                </span>
              ))}
              <Link
                href={hrefWith({}, Math.min(totalPages, page + 1))}
                aria-disabled={page === totalPages}
                className={`flex items-center gap-1 rounded-full border-2 border-ink-200 px-4 py-2 text-sm font-semibold ${
                  page === totalPages ? "pointer-events-none opacity-40" : "hover:border-ink-900"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
