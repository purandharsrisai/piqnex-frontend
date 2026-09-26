import type { ReactNode } from "react";

// Contact address shown on the About / Contact / Terms / Privacy pages.
// TODO: replace with the real support inbox before launch.
export const CONTACT_EMAIL = "support@piqnex.com";

/**
 * Shared layout for long-form text pages (About, Terms, Privacy): a centered
 * header followed by a readable single column of titled sections.
 */
export function ContentPage({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: ReactNode;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-16">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-ink-600">{intro}</p>}
        {lastUpdated && <p className="mt-3 text-sm text-ink-400">Last updated: {lastUpdated}</p>}
      </div>
      <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">{children}</div>
    </div>
  );
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-600 [&_a]:text-clay-700 [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
