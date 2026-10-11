import { Inbox, SearchX } from "lucide-react";
import { LinkButton } from "./Button";

/** Shown when a list/search legitimately has zero results. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink-200 bg-ink-50/60 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-100 text-clay-600"><Icon className="h-6 w-6" aria-hidden="true" /></span>
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {actionHref && actionLabel && (
        <LinkButton href={actionHref} size="sm" className="mt-2">
          {actionLabel}
        </LinkButton>
      )}
    </div>
  );
}

/** Shown when a search/match specifically comes back empty. */
export function NoMatchState(props: Omit<Parameters<typeof EmptyState>[0], "icon">) {
  return <EmptyState icon={SearchX} {...props} />;
}
