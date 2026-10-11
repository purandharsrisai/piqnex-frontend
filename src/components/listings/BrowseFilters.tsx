import { SlidersHorizontal } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { PriceInput } from "@/components/ui/PriceInput";
import { Input, Select } from "@/components/ui/Input";
import { Button, LinkButton } from "@/components/ui/Button";
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
  sort?: string;
}

/**
 * Plain GET form - filters are just URL query params, so results are
 * shareable/bookmarkable and work without client-side JavaScript. Shown as a
 * sidebar card on desktop. The search text lives in the page header and is
 * carried along here as a hidden field so applying filters keeps it.
 */
export function BrowseFilters({ defaults }: { defaults?: BrowseFiltersDefaults }) {
  return (
    <form
      action="/browse"
      method="GET"
      className="flex flex-col gap-5 rounded-3xl border border-ink-100 bg-white p-5 shadow-card"
    >
      <h2 className="hidden items-center gap-2 font-display text-lg text-ink-900 lg:flex">
        <SlidersHorizontal className="h-4 w-4 text-clay-600" aria-hidden="true" />
        Filters
      </h2>
      {defaults?.q && <input type="hidden" name="q" value={defaults.q} />}

      <Field label="Category">
        <CategorySelect name="category" defaultValue={defaults?.category ?? ""} />
      </Field>

      <fieldset className="flex flex-col gap-4 border-t border-ink-100 pt-5">
        <legend className="sr-only">Product details</legend>
        <Field label="Brand">
          <Input name="brand" defaultValue={defaults?.brand} placeholder="e.g. Sony" />
        </Field>
        <Field label="Product">
          <Input name="product" defaultValue={defaults?.product} placeholder="e.g. Inspiron 15" />
        </Field>
        <Field label="Model / Version">
          <Input name="model" defaultValue={defaults?.model} placeholder="e.g. 2021" />
        </Field>
        <Field label="Part">
          <Input name="part" defaultValue={defaults?.part} placeholder="e.g. Charger" />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-ink-100 pt-5">
        <Field label="Condition">
          <ConditionSelect name="condition" defaultValue={defaults?.condition ?? ""} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Min price (INR)">
            <PriceInput name="minPrice" defaultValue={defaults?.minPrice} placeholder="0" />
          </Field>
          <Field label="Max price (INR)">
            <PriceInput name="maxPrice" defaultValue={defaults?.maxPrice} placeholder="Any" />
          </Field>
        </div>
        <Field label="Location">
          <Input name="location" defaultValue={defaults?.location} placeholder="e.g. Pune" />
        </Field>
        <Field label="Sort by">
          <Select name="sort" defaultValue={defaults?.sort ?? "newest"}>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </Select>
        </Field>
      </div>

      <div className="flex flex-col gap-2 border-t border-ink-100 pt-5">
        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
        <LinkButton href={defaults?.q ? `/browse?q=${encodeURIComponent(defaults.q)}` : "/browse"} variant="ghost" size="sm" className="w-full">
          Clear filters
        </LinkButton>
      </div>
    </form>
  );
}
