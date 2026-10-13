"use client";

import { useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";

/**
 * Wraps the filter form: always visible on desktop (as a sidebar), and a
 * show/hide panel behind a "Filters" button on phones.
 */
export function FilterPanel({ activeCount, children }: { activeCount: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-2xl border-2 border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-900 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-clay-600 px-2 py-0.5 text-xs font-bold text-white">{activeCount}</span>
          )}
        </span>
        {open ? <X className="h-4 w-4" aria-hidden="true" /> : <span className="text-ink-400">Show</span>}
      </button>
      <div className={open ? "mt-3 block" : "hidden lg:block"}>{children}</div>
    </div>
  );
}
