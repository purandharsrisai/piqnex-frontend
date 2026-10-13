import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** A titled card holding a stack of settings rows, divided by thin lines. */
export function SettingsGroup({
  title,
  description,
  tone = "default",
  children,
}: {
  title: string;
  description?: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <section aria-label={title}>
      <h2 className={cn("px-1 font-display text-lg", tone === "danger" ? "text-red-700" : "text-ink-900")}>{title}</h2>
      {description && <p className="mt-0.5 px-1 text-sm text-ink-500">{description}</p>}
      <div
        className={cn(
          "mt-3 divide-y divide-ink-100 overflow-hidden rounded-3xl border bg-white shadow-card",
          tone === "danger" ? "border-red-100" : "border-ink-100"
        )}
      >
        {children}
      </div>
    </section>
  );
}

const iconTone = {
  clay: "bg-clay-50 text-clay-600",
  moss: "bg-moss-50 text-moss-700",
  ink: "bg-ink-100 text-ink-700",
};

function RowBody({
  icon: Icon,
  tone = "clay",
  title,
  text,
  trailing,
}: {
  icon: ComponentType<{ className?: string }>;
  tone?: keyof typeof iconTone;
  title: string;
  text?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconTone[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink-900">{title}</span>
        {text && <span className="block truncate text-sm text-ink-500">{text}</span>}
      </span>
      {trailing}
    </>
  );
}

/** A row that opens another page. */
export function SettingsLinkRow(props: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  tone?: keyof typeof iconTone;
  title: string;
  text?: ReactNode;
}) {
  const { href, ...rest } = props;
  return (
    <Link href={href} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink-50">
      <RowBody
        {...rest}
        trailing={
          <ChevronRight
            className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        }
      />
    </Link>
  );
}

/** A row with a control (button) on the right instead of a link. */
export function SettingsActionRow(props: {
  icon: ComponentType<{ className?: string }>;
  tone?: keyof typeof iconTone;
  title: string;
  text?: ReactNode;
  action?: ReactNode;
}) {
  const { action, ...rest } = props;
  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4">
      <RowBody {...rest} trailing={action ? <div className="shrink-0">{action}</div> : undefined} />
    </div>
  );
}
