"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/lib/actions/auth";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Saving..." : "Set New Password"}
    </Button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useFormState(resetPasswordAction, IDLE_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <Field
        label="New password"
        required
        hint="At least 8 characters"
        error={state.fieldErrors?.newPassword}
      >
        <PasswordInput name="newPassword" autoComplete="new-password" />
      </Field>
      <Field label="Confirm new password" required error={state.fieldErrors?.confirmPassword}>
        <PasswordInput name="confirmPassword" autoComplete="new-password" />
      </Field>
      <SubmitButton />
    </form>
  );
}
