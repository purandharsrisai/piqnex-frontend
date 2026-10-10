import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getConversations } from "@/lib/messages";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const conversations = await getConversations();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl text-ink-900">Messages</h1>
      <p className="mt-1 text-sm text-ink-500">Conversations with buyers and sellers about parts.</p>

      {conversations.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-ink-300" aria-hidden="true" />
          <p className="mt-3 font-semibold text-ink-900">No messages yet</p>
          <p className="mt-1 text-sm text-ink-500">
            When you contact a seller, or a buyer contacts you, the conversation shows up here.
          </p>
          <Link href="/browse" className="mt-4 inline-block text-sm font-semibold text-clay-600 hover:underline">
            Browse parts
          </Link>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2" data-testid="conversation-list">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                  {c.other.displayName[0]?.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-ink-900">{c.other.displayName}</span>
                    <span className="shrink-0 text-xs text-ink-400">{formatDate(c.lastMessageAt)}</span>
                  </span>
                  <span className="block truncate text-xs font-semibold text-clay-600">
                    {c.listing.brandName} {c.listing.productName} - {c.listing.partName}
                  </span>
                  <span className={`block truncate text-sm ${c.unread ? "font-semibold text-ink-900" : "text-ink-500"}`}>
                    {c.lastMessage?.body}
                  </span>
                </span>
                {c.unread > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-clay-600 px-1.5 text-xs font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
