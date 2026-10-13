"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { deleteAccountAction } from "@/lib/actions/messages";
import { IDLE_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function Confirm() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" variant="danger" disabled={pending}>{pending ? "Deleting..." : "Delete forever"}</Button>;
}

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState(deleteAccountAction, IDLE_STATE);
  return (
    <div className="mt-6 border-t border-ink-100 pt-5">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-red-600 hover:underline">
          Delete my account
        </button>
      ) : (
        <form action={action} className="flex flex-col gap-3">
          <p className="text-sm text-ink-600">
            This permanently removes your account, listings, requests and messages. Enter your password to confirm.
          </p>
          <Input type="password" name="password" placeholder="Password" autoComplete="current-password" aria-label="Password" />
          {state.status === "error" && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
          <div className="flex gap-2">
            <Confirm />
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
