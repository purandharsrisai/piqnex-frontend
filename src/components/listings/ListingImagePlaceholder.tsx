import { cn } from "@/lib/utils";

// A small, deterministic set of in-palette tints (never a random hue) so a
// row of placeholders feels like one considered system, not confetti.
const TINTS = [
  { bg: "bg-clay-100", text: "text-clay-600", blob: "bg-clay-200" },
  { bg: "bg-moss-100", text: "text-moss-600", blob: "bg-moss-200" },
  { bg: "bg-ink-100", text: "text-ink-600", blob: "bg-ink-200" },
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
  const { bg, text, blob } = tintFor(label);
  const initial = label.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", bg, className)}>
      <div className={cn("absolute -bottom-10 -right-8 h-36 w-36 rounded-full", blob)} aria-hidden="true" />
      <div className={cn("absolute -left-6 -top-8 h-24 w-24 rounded-full opacity-60", blob)} aria-hidden="true" />
      <span className={cn("relative font-display text-7xl", text)} aria-hidden="true">
        {initial}
      </span>
    </div>
  );
}
