import type { ReactNode } from "react";

/** A numbered group of fields inside a long form: badge, title, short hint, then the fields. */
export function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay-600 text-sm font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="font-display text-lg leading-tight text-ink-900">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:pl-11">{children}</div>
    </section>
  );
}

/** Thin divider between form sections. */
export function FormDivider() {
  return <hr className="border-ink-100" />;
}
