"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./Avatar";
import { previewOf } from "@/lib/message-format";
import type { ConversationSummary } from "@/lib/messages";

type Tab = "all" | "buying" | "selling";

/** "10:42 am" for today, "Yesterday", otherwise "12 Oct". */
function shortWhen(iso: string) {
  const d = new Date(iso);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  if (diffDays <= 0) return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(d);
  if (diffDays === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(d);
}

export function ConversationList({ conversations, activeId }: { conversations: ConversationSummary[]; activeId?: string }) {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const count = (t: Tab) => (t === "all" ? conversations.length : conversations.filter((c) => c.role === t).length);
  const rows = useMemo(() => {
    const byTab = tab === "all" ? conversations : conversations.filter((c) => c.role === tab);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((c) =>
      [c.other.displayName, c.listing.brandName, c.listing.productName, c.listing.partName, previewOf(c.lastMessage?.body)].some((f) =>
        f.toLowerCase().includes(q),
      ),
    );
  }, [conversations, tab, query]);
  const unreadTotal = conversations.reduce((n, c) => n + c.unread, 0);

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "buying", label: "Buying" },
    { id: "selling", label: "Selling" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pb-3 pt-5">
        <h1 className="sr-only">Messages</h1>
        <label className="relative mb-3 block">
          <span className="sr-only">Search messages</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            placeholder="Search people or parts"
            className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-clay-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay-400"
          />
        </label>
        <div role="tablist" aria-label="Filter conversations" className="flex items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-3 py-1 text-[13px] font-bold transition-colors",
                tab === t.id ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {t.label} <span className={tab === t.id ? "text-white/70" : "text-ink-400"}>{count(t.id)}</span>
            </button>
          ))}
          {unreadTotal > 0 && <span className="ml-auto text-xs font-bold text-clay-600">{unreadTotal} unread</span>}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink-500">
          {conversations.length === 0
            ? "No conversations yet."
            : query.trim()
              ? `No conversations match "${query.trim()}".`
              : `No ${tab} conversations.`}
        </p>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3" data-testid="conversation-list">
          {rows.map((c) => {
            const active = c.id === activeId;
            return (
              <li key={c.id} className="min-w-0 border-b border-ink-100 last:border-b-0">
                <Link
                  href={`/messages/${c.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "my-1 flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                    active ? "bg-clay-50" : "hover:bg-ink-50",
                  )}
                >
                  <ChatAvatar name={c.other.displayName} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink-900">{c.other.displayName}</span>
                      <span className="shrink-0 text-[11px] text-ink-400">{shortWhen(c.lastMessageAt)}</span>
                    </span>
                    <span className={cn("block truncate text-[13px]", c.unread ? "font-semibold text-ink-900" : "text-ink-500")}>
                      {previewOf(c.lastMessage?.body)}
                    </span>
                  </span>
                  {c.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-600 px-1.5 text-[11px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
