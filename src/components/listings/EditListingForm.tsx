"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateListingAction } from "@/lib/actions/listings";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { PriceInput } from "@/components/ui/PriceInput";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConditionSelect } from "./ConditionSelect";
import type { ListingDetail } from "@/lib/listings";

function Save() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}

export function EditListingForm({ listing }: { listing: ListingDetail }) {
  const [state, action] = useFormState(updateListingAction, IDLE_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="listingId" value={listing.id} />
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.message}</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Brand" required error={errors.brand}>
          <Input name="brand" defaultValue={listing.brand} />
        </Field>
        <Field label="Product" required error={errors.product}>
          <Input name="product" defaultValue={listing.product} />
        </Field>
        <Field label="Model / Version" error={errors.model}>
          <Input name="model" defaultValue={listing.model ?? ""} />
        </Field>
        <Field label="Part" required error={errors.part}>
          <Input name="part" defaultValue={listing.part} />
        </Field>
        <Field label="Condition" required error={errors.condition}>
          <ConditionSelect name="condition" defaultValue={listing.condition} />
        </Field>
        <Field label="Price (INR)" required error={errors.price}>
          <PriceInput name="price" defaultValue={listing.price} />
        </Field>
      </div>
      <Field label="Description" required error={errors.description}>
        <Textarea name="description" rows={4} defaultValue={listing.description} />
      </Field>
      <Field label="Location" error={errors.location}>
        <Input name="location" defaultValue={listing.location ?? ""} />
      </Field>
      <p className="text-xs text-ink-400">Photos can&rsquo;t be changed here yet.</p>
      <Save />
    </form>
  );
}
