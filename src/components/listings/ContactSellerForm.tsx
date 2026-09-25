"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createContactRequestAction } from "@/lib/actions/contact";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Textarea, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="md" className="w-full">
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export function ContactSellerForm({ listingId }: { listingId: string }) {
  const [state, formAction] = useFormState(createContactRequestAction, IDLE_STATE);

  if (state.status === "success") {
    return (
      <Card className="border-moss-200 bg-moss-50 p-4 text-moss-900">
        <p className="text-sm font-medium">{state.message}</p>
      </Card>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="listingId" value={listingId} />
      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
      <Field label="Message to seller" required error={state.fieldErrors?.message}>
        <Textarea
          name="message"
          rows={3}
          placeholder="Hi! Is this still available? I have the same model..."
        />
      </Field>
      <Field label="Your contact info" hint="Phone/email/WhatsApp - shown only to the seller">
        <Input name="contact_info" placeholder="e.g. WhatsApp: 98xxxxxxxx" />
      </Field>
      <SubmitButton />
    </form>
  );
}
