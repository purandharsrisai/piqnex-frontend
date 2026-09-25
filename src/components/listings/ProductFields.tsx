import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { CategorySelect } from "./CategorySelect";

export interface ProductFieldsDefaults {
  category?: string;
  brand?: string;
  product?: string;
  model?: string;
  part?: string;
}

/**
 * The shared "which exact product/part" block used by both the buyer
 * (I NEED) and seller (I HAVE) forms. Keeping it in one place is what makes
 * the Category -> Brand -> Product -> Model -> Part hierarchy consistent
 * across the whole app.
 */
export function ProductFields({
  defaults,
  errors,
  partLabel = "Part / Component",
  partPlaceholder = "e.g. Right Earbud, 65W Charger, Battery",
}: {
  defaults?: ProductFieldsDefaults;
  errors?: Record<string, string>;
  partLabel?: string;
  partPlaceholder?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Category" required error={errors?.category}>
        <CategorySelect name="category" defaultValue={defaults?.category ?? ""} />
      </Field>
      <Field label="Brand" required error={errors?.brand}>
        <Input name="brand" placeholder="e.g. Sony, Dell, Canon" defaultValue={defaults?.brand ?? ""} />
      </Field>
      <Field label="Product" required error={errors?.product}>
        <Input
          name="product"
          placeholder="e.g. WF-1000XM4, Inspiron 15 5510"
          defaultValue={defaults?.product ?? ""}
        />
      </Field>
      <Field
        label="Generation / Version"
        hint="Leave blank if not applicable"
        error={errors?.model}
      >
        <Input name="model" placeholder="e.g. 2021, Gen 2, 41mm" defaultValue={defaults?.model ?? ""} />
      </Field>
      <div className="sm:col-span-2">
        <Field label={partLabel} required error={errors?.part}>
          <Input name="part" placeholder={partPlaceholder} defaultValue={defaults?.part ?? ""} />
        </Field>
      </div>
    </div>
  );
}
