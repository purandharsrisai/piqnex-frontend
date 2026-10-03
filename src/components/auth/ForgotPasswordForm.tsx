"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Please wait..." : "Reset Password"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(forgotPasswordAction, IDLE_STATE);

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
      <Field label="Email" required error={state.fieldErrors?.email}>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <SubmitButton />
      <p className="text-center text-sm text-ink-500">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-clay-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
