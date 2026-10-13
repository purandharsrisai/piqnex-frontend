import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star row; `value` can be fractional (rounded to nearest whole star for display). */
export function Stars({ value, className }: { value: number; className?: string }) {
  const filled = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-4 w-4", n <= filled ? "fill-amber-400 text-amber-400" : "text-ink-200")} aria-hidden="true" />
      ))}
    </span>
  );
}
