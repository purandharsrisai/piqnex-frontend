import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getThread } from "@/lib/messages";
import { ReplyForm } from "@/components/messages/ReplyForm";
import { ChatActions } from "@/components/messages/ChatActions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const thread = await getThread(params.id);
  if (!thread) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6">
      <Link
        href="/messages"
        className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All messages
      </Link>

      <div className="flex items-start justify-between gap-3 rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="min-w-0">
          <p className="font-display text-xl text-ink-900">{thread.other.displayName}</p>
          <Link href={`/parts/${thread.listing.id}`} className="text-sm font-semibold text-clay-600 hover:underline">
            {thread.listing.brandName} {thread.listing.productName} - {thread.listing.partName}
          </Link>
          <p className="text-xs text-ink-500">
            {formatPrice(Number(thread.listing.price), thread.listing.currency)}
            {thread.listing.status !== "active" && ` - ${thread.listing.status}`}
          </p>
        </div>
        <ChatActions userId={thread.other.id} conversationId={thread.id} listingId={thread.listing.id} />
      </div>

      <ol className="my-6 flex flex-col gap-2" data-testid="thread">
        {thread.messages.map((m) => {
          const mine = m.senderId === thread.me;
          return (
            <li key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[15px] ${
                  mine ? "rounded-br-md bg-clay-600 text-white" : "rounded-bl-md bg-ink-100 text-ink-900"
                }`}
              >
                {m.body}
                <span className={`mt-1 block text-[11px] ${mine ? "text-white/70" : "text-ink-400"}`}>
                  {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(m.createdAt))}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <ReplyForm conversationId={thread.id} />
    </div>
  );
}
