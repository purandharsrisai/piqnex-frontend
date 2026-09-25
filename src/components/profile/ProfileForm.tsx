"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction } from "@/lib/actions/profile";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function ProfileForm({
  displayName,
  location,
}: {
  displayName: string;
  location: string | null;
}) {
  const [state, formAction] = useFormState(updateProfileAction, IDLE_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm font-medium text-moss-700">{state.message}</p>
      )}
      <Field label="Display name" required error={state.fieldErrors?.display_name}>
        <Input name="display_name" defaultValue={displayName} />
      </Field>
      <Field label="Location" hint="Shown on your listings">
        <Input name="location" defaultValue={location ?? ""} placeholder="e.g. Bengaluru, KA" />
      </Field>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
