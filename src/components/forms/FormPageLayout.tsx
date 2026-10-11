import type { ReactNode } from "react";

/** Form on the left, helper panel on the right. On phones the panel stacks below the form. */
export function FormPageLayout({ form, side }: { form: ReactNode; side: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10 lg:px-8">
      <div className="min-w-0">{form}</div>
      {side}
    </div>
  );
}
