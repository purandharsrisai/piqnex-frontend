import { apiFetch } from "@/lib/api-client";

export interface ChatUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ConversationSummary {
  id: string;
  listing: { id: string; partName: string; productName: string; brandName: string };
  other: ChatUser;
  lastMessage: { id: string; senderId: string; body: string; createdAt: string } | null;
  lastMessageAt: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface ConversationThread {
  id: string;
  listing: {
    id: string;
    partName: string;
    productName: string;
    brandName: string;
    price: string;
    currency: string;
    status: string;
  };
  other: ChatUser;
  me: string;
  messages: ChatMessage[];
}

export async function getConversations(): Promise<ConversationSummary[]> {
  try {
    return await apiFetch<ConversationSummary[]>("/conversations");
  } catch {
    return [];
  }
}

export async function getThread(id: string): Promise<ConversationThread | null> {
  try {
    return await apiFetch<ConversationThread>(`/conversations/${id}`);
  } catch {
    return null;
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const r = await apiFetch<{ count: number }>("/conversations/unread-count");
    return r.count;
  } catch {
    return 0;
  }
}
