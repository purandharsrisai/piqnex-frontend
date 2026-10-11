"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Lock } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { changePasswordAction } from "@/lib/actions/auth";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button, LinkButton } from "@/components/ui/Button";
import { PasswordStrength } from "./PasswordStrength";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      <Lock className="h-4 w-4" aria-hidden="true" />
      {pending ? "Saving..." : "Update Password"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useFormState(changePasswordAction, IDLE_STATE);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && confirm !== newPassword;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <Toast
        message={state.status === "success" && state.message ? `${state.message} Use your new password next time you log in.` : null}
        trigger={state}
      />

      <Field label="Current password" required error={state.fieldErrors?.currentPassword}>
        <PasswordInput name="currentPassword" autoComplete="current-password" />
      </Field>

      <div className="flex flex-col gap-4 border-t border-ink-100 pt-5">
        <Field label="New password" required error={state.fieldErrors?.newPassword}>
          <PasswordInput
            name="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Field>
        <PasswordStrength value={newPassword} />
        <Field
          label="Confirm new password"
          required
          hint={mismatch ? undefined : "Type the new password again"}
          error={state.fieldErrors?.confirmPassword ?? (mismatch ? "The passwords don't match yet" : undefined)}
        >
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <LinkButton href="/settings" variant="ghost" size="lg">
          Cancel
        </LinkButton>
        <SubmitButton />
      </div>
    </form>
  );
}
