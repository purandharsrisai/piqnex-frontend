"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

/**
 * Scrolling message area. Opens at the first unread message (marked with
 * id="first-unread") when there is one, otherwise at the newest message, and
 * shows a "jump to latest" pill whenever you've scrolled away from the bottom.
 */
export function ThreadScroll({ children, count, unread = 0 }: { children: React.ReactNode; count: number; unread?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [away, setAway] = useState(false);

  function toBottom(smooth = false) {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const marker = el.querySelector<HTMLElement>("#first-unread");
    if (marker) el.scrollTop = Math.max(0, marker.offsetTop - 64);
    else toBottom();
    setAway(el.scrollHeight - el.scrollTop - el.clientHeight > 160);
  }, [count]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setAway(el.scrollHeight - el.scrollTop - el.clientHeight > 160);
        }}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-ink-50 px-4 py-5 sm:px-8"
      >
        {children}
      </div>
      {away && (
        <button
          type="button"
          onClick={() => toBottom(true)}
          className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-xs font-bold text-white shadow-pop transition-colors hover:bg-ink-700"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          {unread > 0 ? `${unread} new message${unread === 1 ? "" : "s"}` : "Latest"}
        </button>
      )}
    </div>
  );
}
