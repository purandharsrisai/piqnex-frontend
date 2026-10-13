import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

/**
 * Right-hand helper panel for the Sell and Need pages: an illustration, a
 * short "how it works" list and a few tips. Sticks to the top on desktop.
 */
export function SideGuide({
  art,
  title,
  steps,
  tipsTitle,
  tips,
}: {
  art: ReactNode;
  title: string;
  steps: { title: string; text: string }[];
  tipsTitle: string;
  tips: string[];
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-clay-100 bg-clay-50/70 p-6">
        <div className="mx-auto h-40 w-full max-w-[280px]" aria-hidden="false">
          {art}
        </div>
        <h2 className="mt-4 font-display text-xl text-ink-900">{title}</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-clay-600 ring-2 ring-clay-200">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{s.title}</p>
                <p className="mt-0.5 text-sm text-ink-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-card">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <ShieldCheck className="h-4 w-4 text-moss-600" aria-hidden="true" />
            {tipsTitle}
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
            {tips.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
