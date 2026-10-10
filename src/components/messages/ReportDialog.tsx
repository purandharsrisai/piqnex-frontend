"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Flag } from "lucide-react";
import { reportAction } from "@/lib/actions/messages";
import { IDLE_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" variant="danger" disabled={pending}>{pending ? "Sending..." : "Submit report"}</Button>;
}

export function ReportDialog({
  targetType,
  targetId,
  label = "Report",
}: {
  targetType: "listing" | "user";
  targetId: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState(reportAction, IDLE_STATE);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-red-600"
      >
        <Flag className="h-4 w-4" aria-hidden="true" /> {label}
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Report" className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-pop">
            {state.status === "success" ? (
              <>
                <p className="font-semibold text-ink-900">{state.message}</p>
                <Button className="mt-4" size="sm" onClick={() => setOpen(false)}>Close</Button>
              </>
            ) : (
              <form action={action} className="flex flex-col gap-3">
                <h2 className="font-display text-xl text-ink-900">Report this {targetType}</h2>
                <input type="hidden" name="targetType" value={targetType} />
                <input type="hidden" name="targetId" value={targetId} />
                <label className="text-sm font-semibold text-ink-700">
                  Reason
                  <select name="reason" required defaultValue="" className="mt-1 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-[15px]">
                    <option value="" disabled>Choose a reason</option>
                    <option value="spam">Spam or duplicate</option>
                    <option value="scam">Looks like a scam</option>
                    <option value="prohibited">Prohibited item</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="other">Something else</option>
                  </select>
                </label>
                <Textarea name="details" rows={3} maxLength={1000} placeholder="Add details (optional)" aria-label="Details" />
                {state.status === "error" && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Submit />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
