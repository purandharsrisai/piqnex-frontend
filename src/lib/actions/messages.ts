"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { DEMO_MODE } from "@/lib/demo-data";
import type { ActionState } from "./types";

export async function sendMessageAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { status: "error", message: "Write a message first." };
  if (body.length > 2000) return { status: "error", message: "Message is too long (2000 max)." };
  try {
    await apiFetch(`/conversations/${id}/messages`, { method: "POST", body: { body } });
  } catch (e) {
    return {
      status: "error",
      message: e instanceof ApiError && e.status === 403 ? "You can't reply to this conversation." : "Couldn't send. Please try again.",
    };
  }
  revalidatePath(`/messages/${id}`);
  revalidatePath("/messages");
  return { status: "success" };
}

/**
 * Sends a photo (already shrunk to a small JPEG in the browser) as a chat message
 * stored as "Photo: <where it lives>". With real storage the photo is uploaded first;
 * until photo storage is set up on the backend this reports that clearly (demo mode
 * keeps the picture inside the message so you can try the UI).
 */
export async function sendPhotoAction(conversationId: string, dataUrl: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(dataUrl)) return { status: "error", message: "Choose a JPEG, PNG or WebP photo." };
  if (dataUrl.length > 450_000) return { status: "error", message: "That photo is too large. Try a smaller one." };

  try {
    let ref = dataUrl;
    if (!DEMO_MODE) {
      const uploaded = await apiFetch<{ storagePath: string }>("/uploads/listing-image", {
        method: "POST",
        body: { filename: "chat-photo.jpg", contentType: "image/jpeg" },
      });
      ref = uploaded.storagePath;
    }
    await apiFetch(`/conversations/${conversationId}/messages`, { method: "POST", body: { body: `Photo: ${ref}` } });
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof ApiError && e.status === 501
          ? "Photo sharing isn't available yet - photo storage hasn't been set up."
          : "Couldn't send the photo. Please try again.",
    };
  }
  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { status: "success", message: "Photo sent." };
}

export async function blockUserAction(userId: string, conversationId: string) {
  await apiFetch(`/blocks/${userId}`, { method: "POST" });
  revalidatePath(`/messages/${conversationId}`);
  redirect("/messages");
}

export async function reportAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const targetType = String(formData.get("targetType") ?? "");
  const targetId = String(formData.get("targetId") ?? "");
  const reason = String(formData.get("reason") ?? "");
  const details = String(formData.get("details") ?? "").trim();
  try {
    await apiFetch("/reports", {
      method: "POST",
      body: { targetType, targetId, reason, details: details || undefined },
    });
  } catch {
    return { status: "error", message: "Couldn't submit the report. Please try again." };
  }
  return { status: "success", message: "Thanks - our team will review this." };
}

export async function deleteAccountAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { status: "error", message: "Enter your password to confirm." };
  try {
    await apiFetch("/profile/me", { method: "DELETE", body: { password } });
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof ApiError && e.status === 401
          ? "That password doesn't match our records."
          : "Couldn't delete the account. Please try again.",
    };
  }
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
  redirect("/?deleted=1");
}
