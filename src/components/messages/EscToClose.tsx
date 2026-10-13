"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Pressing Esc closes the open conversation and goes back to the inbox. */
export function EscToClose() {
  const router = useRouter();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // Let an open dialog (e.g. Report) or the search box handle Esc itself.
      if (document.querySelector("[role='dialog']")) return;
      if ((e.target as HTMLElement | null)?.closest("input[type='search']")) return;
      router.push("/messages");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
