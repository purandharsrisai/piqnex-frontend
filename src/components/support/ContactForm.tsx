"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2, Send } from "lucide-react";
import { sendContactMessageAction } from "@/lib/actions/support";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      <Send className="h-4 w-4" aria-hidden="true" />
      {pending ? "Sending..." : "Send message"}
    </Button>
  );
}

export function ContactForm({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction] = useFormState(sendContactMessageAction, IDLE_STATE);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
        <Toast message="Message sent." trigger={state} />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 text-moss-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl text-ink-900">Message sent</h2>
        <p className="max-w-sm text-sm text-ink-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required error={state.fieldErrors?.name}>
          <Input name="name" autoComplete="name" defaultValue={defaultName} placeholder="e.g. Priya S." />
        </Field>
        <Field label="Email" required error={state.fieldErrors?.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
          />
        </Field>
      </div>
      <Field label="What is this about?" required error={state.fieldErrors?.topic}>
        <Select name="topic" defaultValue="account">
          <option value="account">Account help</option>
          <option value="listing">Listings and requests</option>
          <option value="report">Reporting a problem</option>
          <option value="feedback">Feedback and ideas</option>
          <option value="other">Something else</option>
        </Select>
      </Field>
      <Field
        label="Message"
        required
        hint="Include a link to the listing or request if it is about one. Please don't send passwords or payment details."
        error={state.fieldErrors?.message}
      >
        <Textarea name="message" rows={6} maxLength={2000} placeholder="Tell us how we can help..." />
      </Field>
      {/* Honeypot: invisible to people, bots tend to fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
