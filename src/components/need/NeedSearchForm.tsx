import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductFields, type ProductFieldsDefaults } from "@/components/listings/ProductFields";

/**
 * Plain HTML GET form - no client JS required. Submitting it just navigates
 * to /need?category=...&brand=...&... which the server component reads via
 * `searchParams` to run the search. Simple, fast, and works even if
 * JavaScript fails to load.
 */
export function NeedSearchForm({ defaults }: { defaults?: ProductFieldsDefaults & { description?: string; location?: string } }) {
  return (
    <form action="/need" method="GET" className="flex flex-col gap-5">
      <ProductFields
        defaults={defaults}
        partLabel="Missing Part"
        partPlaceholder="e.g. Right Earbud, Charger, Battery Cover"
      />
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
      <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
        Find My Part
      </Button>
    </form>
  );
}
