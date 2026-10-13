import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        title={title}
        subtitle={
          <>
            {intro}
            {lastUpdated && (
              <span className="mt-2 block text-sm font-medium text-ink-400">
                Last updated: {lastUpdated}
              </span>
            )}
          </>
        }
      />
      <div className="mx-auto max-w-3xl space-y-12 px-4 pt-12 sm:px-6">{children}</div>
    </div>
  );
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 text-[17px] leading-relaxed text-ink-600 [&_a]:font-semibold [&_a]:text-clay-600 [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
