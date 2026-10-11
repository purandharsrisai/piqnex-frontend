import { cn } from "@/lib/utils";

type Tone = "clay" | "moss" | "neutral" | "warning";

// Small rectangular tags (not fully-rounded pills) with uppercase,
// letter-spaced text - reads more like a price tag or a printed label than
// a generic status pill.
const toneClasses: Record<Tone, string> = {
  clay: "bg-clay-100 text-clay-700",
  moss: "bg-moss-100 text-moss-800",
  neutral: "bg-ink-100 text-ink-700",
  warning: "bg-amber-100 text-amber-900",
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
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
