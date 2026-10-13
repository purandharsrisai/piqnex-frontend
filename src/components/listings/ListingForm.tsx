"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ImagePlus } from "lucide-react";
import { createListingAction } from "@/lib/actions/listings";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { PriceInput } from "@/components/ui/PriceInput";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductFields } from "./ProductFields";
import { ConditionSelect } from "./ConditionSelect";
import { FormSection, FormDivider } from "@/components/forms/FormSection";

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
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <FormSection step={1} title="What are you selling?" description="Tell us the product and the exact part.">
        <ProductFields errors={errors} />
      </FormSection>

      <FormDivider />

      <FormSection step={2} title="Condition, price and details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Condition" required error={errors.condition}>
            <ConditionSelect name="condition" />
          </Field>
          <Field label="Price (INR)" required error={errors.price} hint="Enter 0 if you're giving it away">
            <PriceInput name="price" placeholder="e.g. 2500" />
          </Field>
        </div>
        <Field
          label="Description"
          required
          error={errors.description}
          hint="Condition details, why it's spare, anything a buyer should know"
        >
          <Textarea name="description" rows={4} placeholder="e.g. Original charger, no scratches, works perfectly..." />
        </Field>
      </FormSection>

      <FormDivider />

      <FormSection step={3} title="Photos and location" description="Optional, but listings with photos get far more replies.">
        <Field label="Photos" hint="Up to 6 photos. Clear photos build buyer trust." error={errors.images}>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-clay-200 bg-clay-50/50 px-4 py-8 text-center text-sm text-ink-500 transition-colors hover:border-clay-400 hover:bg-clay-50">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-clay-600 shadow-card">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-semibold text-ink-700">Click to choose photos, or drag them here</span>
            <span className="text-xs">JPG or PNG</span>
            <input type="file" name="images" accept="image/*" multiple className="sr-only" />
          </label>
        </Field>
        <Field label="Location" hint="Optional - helps buyers judge shipping/pickup">
          <Input name="location" placeholder="e.g. Bengaluru, KA" />
        </Field>
      </FormSection>

      <div className="flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">Your listing goes live right away. You can edit it any time.</p>
        <SubmitButton />
      </div>
    </form>
  );
}
