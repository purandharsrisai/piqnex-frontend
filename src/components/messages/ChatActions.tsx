"use client";

import { Ban } from "lucide-react";
import { blockUserAction } from "@/lib/actions/messages";
import { ReportDialog } from "./ReportDialog";

export function ChatActions({ userId, conversationId }: { userId: string; conversationId: string; listingId: string }) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <ReportDialog targetType="user" targetId={userId} label="Report user" />
      <button
        type="button"
        onClick={() => {
          if (confirm("Block this user? You won't be able to message each other.")) {
            void blockUserAction(userId, conversationId);
          }
        }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-red-600"
      >
        <Ban className="h-4 w-4" aria-hidden="true" /> Block
      </button>
    </div>
  );
}
