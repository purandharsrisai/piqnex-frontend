"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

/**
 * Small pop-up confirmation in the top-right corner that hides itself after a few seconds.
 * Pass the form's `state` object as `trigger`: a fresh object arrives on every submit, so the
 * toast shows again each time even when the message text is the same.
 */
export function Toast({
  message,
  trigger,
  duration = 4000,
}: {
  message?: string | null;
  trigger: unknown;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [message, trigger, duration]);

  if (!visible || !message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto relative w-full max-w-sm animate-toast-in overflow-hidden rounded-2xl bg-ink-900 text-white shadow-pop ring-1 ring-white/10"
      >
        <div className="flex items-center gap-3 py-3.5 pl-4 pr-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-500/20 text-moss-300">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{message}</p>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-1.5 text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {/* Time-left bar: shrinks over the toast's lifetime. */}
        <div
          className="h-1 origin-left animate-toast-progress bg-moss-400"
          style={{ animationDuration: `${duration}ms` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
