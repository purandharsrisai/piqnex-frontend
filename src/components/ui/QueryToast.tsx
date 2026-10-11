"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Toast } from "./Toast";

/** Messages for one-off flags that server actions add to the URL when they redirect. */
const MESSAGES: Record<string, string> = {
  created: "Your listing is published.",
  updated: "Listing updated.",
  deleted: "Your account has been deleted.",
};

/**
 * Shows a toast for `?created=1`, `?updated=1` or `?deleted=1`, then removes the flag from the
 * address bar so a refresh or the back button doesn't show it again.
 */
export function QueryToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  useEffect(() => {
    const key = Object.keys(MESSAGES).find((k) => params.get(k) === "1");
    if (!key) return;
    setToast({ message: MESSAGES[key], id: Date.now() });
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [params, pathname]);

  return <Toast message={toast?.message ?? null} trigger={toast} />;
}
