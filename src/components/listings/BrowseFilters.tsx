import { Search, SlidersHorizontal } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategorySelect } from "./CategorySelect";
import { ConditionSelect } from "./ConditionSelect";

export interface BrowseFiltersDefaults {
  q?: string;
  category?: string;
  brand?: string;
  product?: string;
  model?: string;
  part?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
}

/**
 * Plain GET form - filters are just URL query params, so results are
 * shareable/bookmarkable and work without client-side JavaScript. The
 * advanced fields live inside a native <details> disclosure, which keeps
 * the mobile view uncluttered without needing any state management.
 */
export function BrowseFilters({ defaults }: { defaults?: BrowseFiltersDefaults }) {
  return (
    <form action="/browse" method="GET" className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-clay-400">
        <Search className="h-5 w-5 shrink-0 text-ink-400" aria-hidden="true" />
        <label htmlFor="browse-q" className="sr-only">
          Search parts
        </label>
        <input
          id="browse-q"
          type="search"
          name="q"
          defaultValue={defaults?.q}
          placeholder="Search brand, product, or part..."
          className="w-full border-none bg-transparent text-[15px] focus:outline-none focus:ring-0"
        />
        <Button type="submit" size="sm">
          Search
        </Button>
      </div>

      <details className="rounded-xl border border-ink-100 bg-ink-50/40 open:pb-4" open>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-ink-700">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </summary>
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Category">
            <CategorySelect name="category" defaultValue={defaults?.category ?? ""} />
          </Field>
          <Field label="Brand">
            <Input name="brand" defaultValue={defaults?.brand} placeholder="e.g. Sony" />
          </Field>
          <Field label="Product">
            <Input name="product" defaultValue={defaults?.product} placeholder="e.g. WF-1000XM4" />
          </Field>
          <Field label="Model / Version">
            <Input name="model" defaultValue={defaults?.model} placeholder="e.g. 2021" />
          </Field>
          <Field label="Part">
            <Input name="part" defaultValue={defaults?.part} placeholder="e.g. Charger" />
          </Field>
          <Field label="Condition">
            <ConditionSelect name="condition" defaultValue={defaults?.condition ?? ""} />
          </Field>
          <Field label="Min Price (INR)">
            <Input name="minPrice" type="number" min={0} defaultValue={defaults?.minPrice} />
          </Field>
          <Field label="Max Price (INR)">
            <Input name="maxPrice" type="number" min={0} defaultValue={defaults?.maxPrice} />
          </Field>
          <Field label="Location">
            <Input name="location" defaultValue={defaults?.location} placeholder="e.g. Pune" />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2 px-4">
          <a href="/browse" className="text-sm text-ink-500 underline-offset-2 hover:underline">
            Clear all
          </a>
          <Button type="submit" size="sm" variant="outline">
            Apply Filters
          </Button>
        </div>
      </details>
    </form>
  );
}
