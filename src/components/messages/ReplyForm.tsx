"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendMessageAction } from "@/lib/actions/messages";
import { IDLE_STATE } from "@/lib/actions/types";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function Send() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send"}
    </Button>
  );
}

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const [state, action] = useFormState(sendMessageAction, IDLE_STATE);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="conversationId" value={conversationId} />
      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>
      )}
      <Textarea name="body" rows={3} placeholder="Write a reply..." aria-label="Reply" />
      <div className="flex justify-end"><Send /></div>
    </form>
  );
}
