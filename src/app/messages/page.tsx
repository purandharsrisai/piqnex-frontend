import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getConversations } from "@/lib/messages";
import { MessagesShell } from "@/components/messages/MessagesShell";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const conversations = await getConversations();
  const empty = conversations.length === 0;

  return (
    <MessagesShell conversations={conversations}>
      <div className="flex flex-1 flex-col items-center justify-center bg-ink-50 p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-clay-50 text-clay-600">
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-xl text-ink-900">{empty ? "No messages yet" : "Select a conversation"}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-500">
          {empty
            ? "When you contact a seller, or a buyer contacts you, the conversation shows up here."
            : "Pick a conversation on the left to read it, see the part and reply."}
        </p>
        {empty && (
          <Link href="/browse" className="mt-4 text-sm font-semibold text-clay-600 hover:underline">
            Browse parts
          </Link>
        )}
      </div>
    </MessagesShell>
  );
}
