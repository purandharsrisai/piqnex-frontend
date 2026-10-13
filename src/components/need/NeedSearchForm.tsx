import { Search } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductFields, type ProductFieldsDefaults } from "@/components/listings/ProductFields";
import { FormSection, FormDivider } from "@/components/forms/FormSection";

/**
 * Plain HTML GET form - no client JS required. Submitting it just navigates
 * to /need?category=...&brand=...&... which the server component reads via
 * `searchParams` to run the search. Simple, fast, and works even if
 * JavaScript fails to load.
 */
export function NeedSearchForm({ defaults }: { defaults?: ProductFieldsDefaults & { description?: string; location?: string } }) {
  return (
    <form action="/need" method="GET" className="flex flex-col gap-6">
      <FormSection step={1} title="What's missing?" description="Tell us the product you have and the part you need.">
        <ProductFields
          defaults={defaults}
          partLabel="Missing Part"
          partPlaceholder="e.g. Charger, Battery cover, Remote"
        />
      </FormSection>

      <FormDivider />

      <FormSection step={2} title="Anything else?" description="Optional details that help us find the exact part.">
        <Field label="Description" hint="Anything else that helps identify the exact part">
          <Textarea
            name="description"
            rows={3}
            placeholder="e.g. Bought in 2022, matte black finish"
            defaultValue={defaults?.description ?? ""}
          />
        </Field>
        <Field label="Location" hint="Optional - helps match with nearby sellers">
          <Input name="location" placeholder="e.g. Bengaluru, KA" defaultValue={defaults?.location ?? ""} />
        </Field>
      </FormSection>

      <div className="flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">Free to search. We only show exact matches.</p>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Search className="h-4 w-4" aria-hidden="true" />
          Find My Part
        </Button>
      </div>
    </form>
  );
}
