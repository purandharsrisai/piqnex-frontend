"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ImagePlus } from "lucide-react";
import { createListingAction } from "@/lib/actions/listings";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductFields } from "./ProductFields";
import { ConditionSelect } from "./ConditionSelect";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? "Publishing..." : "Publish Listing"}
    </Button>
  );
}

export function ListingForm() {
  const [state, formAction] = useFormState(createListingAction, IDLE_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <ProductFields errors={errors} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Condition" required error={errors.condition}>
          <ConditionSelect name="condition" />
        </Field>
        <Field label="Price (INR)" required error={errors.price} hint="Enter 0 if you're giving it away">
          <Input name="price" type="number" min={0} step="1" placeholder="e.g. 2500" />
        </Field>
      </div>

      <Field
        label="Description"
        required
        error={errors.description}
        hint="Condition details, why it's spare, anything a buyer should know"
      >
        <Textarea name="description" rows={4} placeholder="e.g. Lost the left earbud, right one works great..." />
      </Field>

      <Field label="Location" hint="Optional - helps buyers judge shipping/pickup">
        <Input name="location" placeholder="e.g. Bengaluru, KA" />
      </Field>

      <Field
        label="Photos"
        hint="Up to 6 photos. Clear photos build buyer trust."
        error={errors.images}
      >
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-ink-300 bg-ink-50/50 px-4 py-8 text-center text-sm text-ink-500 hover:bg-ink-50">
          <ImagePlus className="h-6 w-6 text-ink-400" aria-hidden="true" />
          <span>Click to choose photos, or drag them here</span>
          <input type="file" name="images" accept="image/*" multiple className="sr-only" />
        </label>
      </Field>

      <SubmitButton />
    </form>
  );
}
