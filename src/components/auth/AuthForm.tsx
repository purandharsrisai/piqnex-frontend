"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { signInAction, signUpAction } from "@/lib/actions/auth";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? "Please wait..." : label}
    </Button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useFormState(signInAction, IDLE_STATE);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/profile"} />
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <Field label="Email" required error={state.fieldErrors?.email}>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field label="Password" required error={state.fieldErrors?.password}>
        <Input name="password" type="password" autoComplete="current-password" />
      </Field>
      <SubmitButton label="Log In" />
      <p className="text-center text-sm text-ink-500">
        New here?{" "}
        <Link href="/signup" className="font-medium text-clay-600 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUpAction, IDLE_STATE);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <Field label="Display name" required error={state.fieldErrors?.displayName}>
        <Input name="displayName" placeholder="e.g. Priya S." autoComplete="name" />
      </Field>
      <Field label="Email" required error={state.fieldErrors?.email}>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </Field>
      <Field label="Password" required hint="At least 6 characters" error={state.fieldErrors?.password}>
        <Input name="password" type="password" autoComplete="new-password" />
      </Field>
      <SubmitButton label="Create Account" />
      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-clay-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
