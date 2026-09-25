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
    <Card className="flex items-center gap-4 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">
          {request.brand} {request.product} - {request.part}
        </p>
        <Badge tone={request.status === "open" ? "clay" : "neutral"} className="mt-1">
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
            <XCircle className="h-4 w-4" aria-hidden="true" />
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
          <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
