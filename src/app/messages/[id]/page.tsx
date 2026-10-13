import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, CheckCheck } from "lucide-react";
import { getConversations, getThread, type ChatMessage } from "@/lib/messages";
import { getSellerRating } from "@/lib/reviews";
import { OFFER_RE, PHOTO_RE } from "@/lib/message-format";
import { publicImageUrl } from "@/lib/listings";
import { MessagesShell } from "@/components/messages/MessagesShell";
import { ChatAvatar } from "@/components/messages/Avatar";
import { PartPanel } from "@/components/messages/PartPanel";
import { ThreadScroll } from "@/components/messages/ThreadScroll";
import { ReplyForm } from "@/components/messages/ReplyForm";
import { ChatActions } from "@/components/messages/ChatActions";
import { EscToClose } from "@/components/messages/EscToClose";

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

function dayLabel(iso: string) {
  const d = new Date(iso);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

const BUYER_REPLIES = ["Is this still available?", "Can you share more photos?", "Where can I pick it up?", "What's your best price?"];
const SELLER_REPLIES = ["Yes, it's still available", "I can share more photos", "Your offer works for me", "Sorry, that's too low for me"];

const timeOf = (iso: string) => new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const [thread, conversations] = await Promise.all([getThread(params.id), getConversations()]);
  if (!thread) notFound();

  // Only show a seller rating when the other person is the one selling this part.
  const rating = thread.listing.sellerId === thread.other.id ? await getSellerRating(thread.other.id) : null;

  const groups: { key: string; label: string; items: ChatMessage[] }[] = [];
  for (const m of thread.messages) {
    const key = dayKey(m.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(m);
    else groups.push({ key, label: dayLabel(m.createdAt), items: [m] });
  }

  const { listing } = thread;
  const iAmSeller = listing.sellerId === thread.me;
  const myReadMs = thread.myReadAt ? new Date(thread.myReadAt).getTime() : null;
  const otherReadMs = thread.otherReadAt ? new Date(thread.otherReadAt).getTime() : null;
  const isUnread = (m: ChatMessage) => m.senderId !== thread.me && (myReadMs === null || new Date(m.createdAt).getTime() > myReadMs);
  const firstUnreadId = thread.messages.find(isUnread)?.id;
  const unreadCount = thread.messages.filter(isUnread).length;
  const lastMineId = [...thread.messages].reverse().find((m) => m.senderId === thread.me)?.id;
  const unavailable = listing.status === "active" ? null : listing.status === "sold" ? "sold" : "no longer listed";

  return (
    <MessagesShell conversations={conversations} activeId={thread.id} details={<PartPanel thread={thread} rating={rating} />}>
      <header className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3.5 sm:px-6">
        <Link
          href="/messages"
          aria-label="Back to all messages"
          className="-ml-1 rounded-full p-2 text-ink-600 hover:bg-ink-100 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <ChatAvatar name={thread.other.displayName} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight text-ink-900">{thread.other.displayName}</p>
          <Link href={`/parts/${listing.id}`} className="block truncate text-xs font-semibold text-clay-600 hover:underline">
            {listing.brandName} {listing.productName} - {listing.partName}
          </Link>
        </div>
        <ChatActions userId={thread.other.id} conversationId={thread.id} listingId={listing.id} />
      </header>

      <ThreadScroll count={thread.messages.length} unread={unreadCount}>
        <ol className="flex flex-col gap-2" data-testid="thread">
          {groups.map((g) => (
            <li key={g.key} className="contents">
              <div className="my-2 self-center rounded-full border border-ink-100 bg-white px-3 py-0.5 text-[11px] font-bold text-ink-500">
                {g.label}
              </div>
              {g.items.map((m) => {
                const mine = m.senderId === thread.me;
                const offerMatch = OFFER_RE.exec(m.body);
                const photoMatch = PHOTO_RE.exec(m.body);
                const receipt =
                  m.id === lastMineId ? (
                    otherReadMs !== null && otherReadMs >= new Date(m.createdAt).getTime() ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-clay-600">
                        <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" /> Seen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-400">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" /> Sent
                      </span>
                    )
                  ) : null;
                const divider =
                  m.id === firstUnreadId ? (
                    <div id="first-unread" className="my-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-clay-600">
                      <span className="h-px flex-1 bg-clay-200" />
                      New messages
                      <span className="h-px flex-1 bg-clay-200" />
                    </div>
                  ) : null;
                if (photoMatch) {
                  const src = photoMatch[1]!.startsWith("data:") ? photoMatch[1]! : publicImageUrl(photoMatch[1]!);
                  return (
                    <div key={m.id} className="flex flex-col gap-1">
                      {divider}
                      <div className={mine ? "flex justify-end" : "flex justify-start"}>
                        <div className={`w-64 overflow-hidden rounded-2xl border p-1 ${mine ? "rounded-br-md border-clay-600 bg-clay-600" : "rounded-bl-md border-ink-100 bg-white"}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink-100">
                            {src && <Image src={src} alt="Photo shared in this chat" fill sizes="256px" unoptimized className="object-cover" />}
                          </div>
                          <span className={`block px-2 pb-1 pt-1.5 text-[11px] ${mine ? "text-white/70" : "text-ink-400"}`}>{timeOf(m.createdAt)}</span>
                        </div>
                      </div>
                      {receipt && <div className="flex justify-end">{receipt}</div>}
                    </div>
                  );
                }
                if (offerMatch) {
                  return (
                    <div key={m.id} className="flex flex-col gap-1">
                      {divider}
                      <div className={mine ? "flex justify-end" : "flex justify-start"}>
                        <div
                          className={`w-60 rounded-2xl border px-4 py-3 ${
                            mine ? "rounded-br-md border-clay-600 bg-clay-600 text-white" : "rounded-bl-md border-clay-200 bg-white text-ink-900"
                          }`}
                        >
                          <p className={`text-[11px] font-bold uppercase tracking-wider ${mine ? "text-white/80" : "text-clay-600"}`}>
                            {mine ? "Your offer" : "Offer"}
                          </p>
                          <p className="font-display text-2xl">{offerMatch[1]}</p>
                          {offerMatch[2] && <p className={`text-xs ${mine ? "text-white/80" : "text-ink-500"}`}>Listed at {offerMatch[2]}</p>}
                          <span className={`mt-1 block text-[11px] ${mine ? "text-white/70" : "text-ink-400"}`}>{timeOf(m.createdAt)}</span>
                        </div>
                      </div>
                      {receipt && <div className="flex justify-end">{receipt}</div>}
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="flex flex-col gap-1">
                    {divider}
                    <div className={mine ? "flex justify-end" : "flex justify-start"}>
                      <div
                        className={`max-w-[80%] whitespace-pre-line break-words [overflow-wrap:anywhere] rounded-2xl px-4 py-2.5 text-[15px] sm:max-w-[70%] ${
                          mine ? "rounded-br-md bg-clay-600 text-white" : "rounded-bl-md border border-ink-100 bg-white text-ink-900"
                        }`}
                      >
                        {m.body}
                        <span className={`mt-1 block text-[11px] ${mine ? "text-white/70" : "text-ink-400"}`}>{timeOf(m.createdAt)}</span>
                      </div>
                    </div>
                    {receipt && <div className="flex justify-end">{receipt}</div>}
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
      </ThreadScroll>

      <ReplyForm
        conversationId={thread.id}
        suggestions={iAmSeller ? SELLER_REPLIES : BUYER_REPLIES}
        offer={iAmSeller ? undefined : { price: Number(listing.price), currency: listing.currency }}
        unavailable={unavailable}
      />
      <EscToClose />
    </MessagesShell>
  );
}
