"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction } from "@/lib/actions/profile";
import { IDLE_STATE } from "@/lib/actions/types";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { AvatarPicker } from "./AvatarPicker";
import { Toast } from "@/components/ui/Toast";
import { Button, LinkButton } from "@/components/ui/Button";
import { FormSection, FormDivider } from "@/components/forms/FormSection";

const BIO_MAX = 200;

// Fields the user can change get a warm tint; locked ones are grey.
const EDITABLE = "!border-clay-300 !bg-clay-50/40 hover:!border-clay-400";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="md"
      className="w-full sm:w-auto"
    >
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function ProfileForm({
  displayName,
  location,
  phone,
  email,
  bio,
  avatarUrl,
}: {
  displayName: string;
  location: string | null;
  phone: string | null;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
}) {
  const [state, formAction] = useFormState(updateProfileAction, IDLE_STATE);
  const [bioText, setBioText] = useState(bio ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </p>
      )}
      <Toast
        message={state.status === "success" ? state.message : null}
        trigger={state}
      />

      <FormSection
        step={1}
        title="About you"
        description="Shown to buyers and sellers you chat with."
      >
        <Field label="Profile photo" error={state.fieldErrors?.avatar}>
          <AvatarPicker initialUrl={avatarUrl} name={displayName || email} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Display name"
            required
            error={state.fieldErrors?.display_name}
          >
            <Input
              name="display_name"
              defaultValue={displayName}
              autoComplete="name"
              className={EDITABLE}
            />
          </Field>
          <Field label="Location" hint="Shown on your listings">
            <Input
              name="location"
              className={EDITABLE}
              defaultValue={location ?? ""}
              placeholder="e.g. Bengaluru, KA"
            />
          </Field>
        </div>
        <Field label="About you" error={state.fieldErrors?.bio}>
          <div>
            <Textarea
              name="bio"
              className={EDITABLE}
              rows={3}
              maxLength={BIO_MAX}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="e.g. I repair laptops and sell spare parts from old models."
            />
            <div className="mt-1 flex items-center justify-between gap-3 text-xs">
              <span className="text-ink-500">
                A short intro for buyers and sellers.
              </span>
              <span
                aria-live="polite"
                className={
                  bioText.length >= BIO_MAX
                    ? "font-semibold text-red-600"
                    : bioText.length >= BIO_MAX - 20
                      ? "text-amber-600"
                      : "text-ink-400"
                }
              >
                {bioText.length}/{BIO_MAX}
              </span>
            </div>
          </div>
        </Field>
      </FormSection>

      <FormDivider />

      <FormSection
        step={2}
        title="Contact"
        description="Optional. We never show your number publicly."
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="profile-email"
            className="flex items-center gap-2 text-sm font-medium text-ink-800"
          >
            Email
          </label>
          <Input
            id="profile-email"
            value={email}
            readOnly
            disabled
            aria-readonly="true"
            className="cursor-not-allowed !border-ink-200 !bg-ink-100 !text-ink-500"
          />
          <p className="text-xs text-ink-500">
            Your sign-in email can&rsquo;t be changed.
          </p>
        </div>
        <Field
          label="Phone number"
          hint="10 digits, no country code"
          error={state.fieldErrors?.phone}
        >
          <Input
            name="phone"
            className={EDITABLE}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            // Older accounts may have a number saved with a country code or spaces - show just the last 10 digits.
            defaultValue={(phone ?? "").replace(/\D/g, "").slice(-10)}
            placeholder="10-digit mobile number"
            maxLength={10}
            pattern="[0-9]{10}"
            title="Enter a 10-digit phone number (no country code)"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 10);
            }}
          />
        </Field>
      </FormSection>

      <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <LinkButton href="/profile" variant="ghost" size="md">
          Cancel
        </LinkButton>
        <SubmitButton />
      </div>
    </form>
  );
}
