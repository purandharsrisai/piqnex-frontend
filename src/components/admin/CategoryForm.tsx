"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IDLE_STATE } from "@/lib/actions/types";
import { adminCreateCategoryAction } from "@/lib/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Adding..." : "Add Category"}
    </Button>
  );
}

export function CategoryForm() {
  const [state, formAction] = useFormState(adminCreateCategoryAction, IDLE_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "success" && state.message && (
        <p className="rounded-xl bg-moss-100 px-4 py-3 text-sm font-medium text-moss-800">{state.message}</p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Name" required error={errors.name}>
          <Input name="name" placeholder="e.g. Audio" />
        </Field>
        <Field label="Slug" required error={errors.slug} hint="lowercase-with-hyphens">
          <Input name="slug" placeholder="e.g. audio" />
        </Field>
        <Field label="Sort order" error={errors.sort_order}>
          <Input name="sort_order" type="number" min={0} placeholder="0" />
        </Field>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
