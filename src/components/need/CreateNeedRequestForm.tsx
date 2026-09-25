"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createNeedRequestAction } from "@/lib/actions/need";
import { IDLE_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="md">
      {pending ? "Saving..." : "Create a Need Request"}
    </Button>
  );
}

/**
 * Shown when a search on /need comes back with no exact match. Re-submits
 * the same product/part details (as hidden fields) so we can save a
 * "need request" - future sellers listing this exact part will surface it.
 */
export function CreateNeedRequestForm({
  category,
  brand,
  product,
  model,
  part,
  description,
  location,
}: {
  category: string;
  brand: string;
  product: string;
  model?: string;
  part: string;
  description?: string;
  location?: string;
}) {
  const [state, formAction] = useFormState(createNeedRequestAction, IDLE_STATE);

  if (state.status === "success") {
    return (
      <Card className="border-moss-200 bg-moss-50 p-5 text-moss-900">
        <p className="font-semibold">Request saved</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </Card>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="brand" value={brand} />
      <input type="hidden" name="product" value={product} />
      <input type="hidden" name="model" value={model ?? ""} />
      <input type="hidden" name="part" value={part} />
      <input type="hidden" name="description" value={description ?? ""} />
      <input type="hidden" name="location" value={location ?? ""} />
      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
