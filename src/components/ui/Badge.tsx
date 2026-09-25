import { cn } from "@/lib/utils";

type Tone = "clay" | "moss" | "neutral" | "warning" | "sample";

// Small rectangular tags (not fully-rounded pills) with uppercase,
// letter-spaced text - reads more like a price tag or a printed label than
// a generic status pill.
const toneClasses: Record<Tone, string> = {
  clay: "bg-clay-100 text-clay-800",
  moss: "bg-moss-100 text-moss-800",
  neutral: "bg-ink-100 text-ink-700",
  warning: "bg-amber-100 text-amber-900",
  sample: "border border-dashed border-ink-300 text-ink-500",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
