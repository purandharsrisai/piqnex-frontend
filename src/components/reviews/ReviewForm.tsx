"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Star } from "lucide-react";
import { createReviewAction } from "@/lib/actions/reviews";
import { IDLE_STATE } from "@/lib/actions/types";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving..." : "Post review"}</Button>;
}

export function ReviewForm({ listingId }: { listingId: string }) {
  const [state, action] = useFormState(createReviewAction, IDLE_STATE);
  const [rating, setRating] = useState(0);

  if (state.status === "success") {
    return <p className="rounded-xl bg-moss-50 px-4 py-3 text-sm font-medium text-moss-900">{state.message}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3" data-testid="review-form">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="rating" value={rating || ""} />
      <div role="radiogroup" aria-label="Rating" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
          >
            <Star className={cn("h-7 w-7", n <= rating ? "fill-amber-400 text-amber-400" : "text-ink-300")} aria-hidden="true" />
          </button>
        ))}
      </div>
      <Textarea name="comment" rows={3} maxLength={1000} placeholder="How was the seller? (optional)" aria-label="Review" />
      {state.status === "error" && <p role="alert" className="text-sm font-medium text-red-600">{state.message}</p>}
      <div><Submit /></div>
    </form>
  );
}
