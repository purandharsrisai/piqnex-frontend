import { cn } from "@/lib/utils";

// A small, deterministic set of in-palette tints (never a random hue) so a
// row of placeholders feels like one considered system, not confetti.
const TINTS = [
  { bg: "bg-clay-100", text: "text-clay-700" },
  { bg: "bg-moss-100", text: "text-moss-700" },
  { bg: "bg-ink-200", text: "text-ink-600" },
] as const;

function tintFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

/**
 * Used whenever a listing has no photo yet - which, for sample/demo data,
 * is always (we deliberately don't hotlink stock photos: they're a
 * dependency that can break, and generic stock photography is its own
 * "template" tell). A plain initial-letter monogram, tinted consistently
 * per listing, reads as an intentional placeholder rather than a broken
 * image or an empty gray box.
 */
export function ListingImagePlaceholder({ label, className }: { label: string; className?: string }) {
  const { bg, text } = tintFor(label);
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={cn("flex h-full w-full items-center justify-center", bg, className)}>
      <span className={cn("font-display text-5xl", text)} aria-hidden="true">
        {initial}
      </span>
    </div>
  );
}
