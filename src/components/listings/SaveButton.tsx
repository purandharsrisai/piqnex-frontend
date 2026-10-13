"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleSavedAction } from "@/lib/actions/saved";
import { cn } from "@/lib/utils";

export function SaveButton({
  listingId,
  initialSaved,
  className,
  withLabel = false,
}: {
  listingId: string;
  initialSaved: boolean;
  className?: string;
  withLabel?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this listing"}
      data-testid="save-button"
      onClick={() => {
        const next = !saved;
        setSaved(next);
        startTransition(async () => {
          const ok = await toggleSavedAction(listingId, next);
          if (!ok) setSaved(!next);
        });
      }}
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-white/95 text-sm font-semibold shadow-card transition-transform hover:scale-105",
        withLabel ? "px-4 py-2" : "h-9 w-9 justify-center",
        className
      )}
    >
      <Heart className={cn("h-5 w-5", saved ? "fill-clay-600 text-clay-600" : "text-ink-500")} aria-hidden="true" />
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
