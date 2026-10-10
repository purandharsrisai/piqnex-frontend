import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page header band used by every inner page: soft brand-tinted
 * background, small uppercase eyebrow, heavy display title, optional subtitle.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <header className="relative overflow-hidden border-b border-ink-100 bg-clay-50/60">
      <div
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-clay-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8",
          center && "text-center"
        )}
      >
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-wider text-clay-600">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl text-ink-900 sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className={cn("mt-3 max-w-2xl text-lg text-ink-600", center && "mx-auto")}>{subtitle}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
