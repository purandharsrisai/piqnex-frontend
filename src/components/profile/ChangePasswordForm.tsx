"use client";

import { useFormState, useFormStatus } from "react-dom";
import { changePasswordAction } from "@/lib/actions/auth";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Saving..." : "Update Password"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changePasswordAction, IDLE_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "success" && state.message && (
        <p className="rounded-xl bg-moss-50 px-4 py-3 text-sm font-medium text-moss-700">
          {state.message}
        </p>
      )}
      <Field label="Current password" required error={state.fieldErrors?.currentPassword}>
        <PasswordInput name="currentPassword" autoComplete="current-password" />
      </Field>
      <Field
        label="New password"
        required
        hint="At least 8 characters"
        error={state.fieldErrors?.newPassword}
      >
        <PasswordInput name="newPassword" autoComplete="new-password" />
      </Field>
      <Field
        label="Confirm new password"
        required
        error={state.fieldErrors?.confirmPassword}
      >
        <PasswordInput name="confirmPassword" autoComplete="new-password" />
      </Field>
      <SubmitButton />
    </form>
  );
}
