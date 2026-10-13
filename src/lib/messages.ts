import { apiFetch } from "@/lib/api-client";
import { publicImageUrl } from "@/lib/listings";

export interface ChatUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ConversationSummary {
  id: string;
  listing: {
    id: string;
    partName: string;
    productName: string;
    brandName: string;
    price: number;
    currency: string;
    status: string;
    imageUrl: string | null;
  };
  /** "buying" = you asked about someone else's part; "selling" = someone asked about yours. */
  role: "buying" | "selling";
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
    modelLabel: string | null;
    condition: string;
    location: string | null;
    sellerId: string;
    price: string;
    currency: string;
    status: string;
    imageUrl: string | null;
  };
  other: ChatUser;
  me: string;
  /** When you last opened this chat, before today's visit (null = never). */
  myReadAt: string | null;
  /** When the other person last opened it (null = never). */
  otherReadAt: string | null;
  messages: ChatMessage[];
}

interface BackendConversationSummary extends Omit<ConversationSummary, "listing"> {
  listing: Omit<ConversationSummary["listing"], "imageUrl" | "price"> & {
    price: number | string;
    images?: { storagePath: string; sortOrder: number }[];
  };
}

export async function getConversations(): Promise<ConversationSummary[]> {
  try {
    const rows = await apiFetch<BackendConversationSummary[]>("/conversations");
    return rows.map(({ listing: { images, price, ...listing }, ...row }) => ({
      ...row,
      listing: {
        ...listing,
        price: Number(price),
        imageUrl: images?.[0] ? publicImageUrl(images[0].storagePath) : null,
      },
    }));
  } catch {
    return [];
  }
}

interface BackendThread extends Omit<ConversationThread, "listing"> {
  listing: Omit<ConversationThread["listing"], "imageUrl"> & { images?: { storagePath: string; sortOrder: number }[] };
}

export async function getThread(id: string): Promise<ConversationThread | null> {
  try {
    const t = await apiFetch<BackendThread>(`/conversations/${id}`);
    const { images, ...listing } = t.listing;
    return { ...t, listing: { ...listing, imageUrl: images?.[0] ? publicImageUrl(images[0].storagePath) : null } };
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
