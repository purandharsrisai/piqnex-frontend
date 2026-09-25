"use client";

import { useTransition } from "react";
import { Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { adminSetNeedRequestStatusAction, adminDeleteNeedRequestAction } from "@/lib/actions/admin";
import type { AdminNeedRequestRow as AdminNeedRequestRowData } from "@/lib/admin-data";

const STATUS_TONE = {
  open: "moss",
  matched: "clay",
  closed: "neutral",
} as const;

export function AdminNeedRequestRow({ request }: { request: AdminNeedRequestRowData }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="flex items-center gap-4 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">
          {request.brand} {request.product} - {request.part}
        </p>
        <p className="text-xs text-ink-500">
          Requested by {request.requesterName} &middot; {formatDate(request.createdAt)}
        </p>
        <div className="mt-1">
          <Badge tone={STATUS_TONE[request.status]}>{request.status}</Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {request.status !== "closed" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => adminSetNeedRequestStatusAction(request.id, "closed"))}
            title="Close"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        {request.status !== "open" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => adminSetNeedRequestStatusAction(request.id, "open"))}
            title="Reopen"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this need request? This can't be undone.")) {
              startTransition(() => adminDeleteNeedRequestAction(request.id));
            }
          }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
