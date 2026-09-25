import { AlertTriangle, Inbox, Loader2, SearchX } from "lucide-react";
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
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center">
      <Icon className="h-9 w-9 text-ink-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
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

/** Shown when something failed unexpectedly - always human-friendly, never a raw error. */
export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment. If this keeps happening, let us know.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center"
    >
      <AlertTriangle className="h-9 w-9 text-red-500" aria-hidden="true" />
      <h3 className="text-base font-semibold text-red-900">{title}</h3>
      <p className="max-w-sm text-sm text-red-700">{description}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 px-6 py-14 text-center text-ink-500"
    >
      <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
