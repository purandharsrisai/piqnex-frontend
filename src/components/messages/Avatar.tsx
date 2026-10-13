import { cn } from "@/lib/utils";

const TONES = ["bg-clay-600", "bg-moss-600", "bg-ink-700", "bg-ink-900", "bg-clay-800"];

/** Round initial avatar; the colour is picked from the name so it stays the same everywhere. */
export function ChatAvatar({ name, size = "md", className }: { name: string; size?: "sm" | "md"; className?: string }) {
  const tone = TONES[[...name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % TONES.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base",
        tone,
        className,
      )}
    >
      {name[0]?.toUpperCase() ?? "?"}
    </span>
  );
}
