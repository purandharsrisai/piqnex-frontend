"use client";

import { useTransition } from "react";
import { Trash2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { closeNeedRequestAction, deleteNeedRequestAction } from "@/lib/actions/need";
import type { MyNeedRequest } from "@/lib/profile-data";

export function MyNeedRequestItem({ request }: { request: MyNeedRequest }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="flex flex-col gap-3 rounded-2xl p-4 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-ink-900">{request.part}</p>
        <p className="truncate text-sm text-ink-500">
          {request.brand} {request.product}
          {request.model ? ` · ${request.model}` : ""}
        </p>
        <Badge tone={request.status === "open" ? "clay" : "neutral"} className="mt-2">
          {request.status}
        </Badge>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {request.status === "open" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => closeNeedRequestAction(request.id))}
            title="Mark as no longer needed"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" /> Close
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this request?")) {
              startTransition(() => deleteNeedRequestAction(request.id));
            }
          }}
          title="Delete"
        >
          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" /> <span className="sr-only">Delete</span>
        </Button>
      </div>
    </Card>
  );
}
