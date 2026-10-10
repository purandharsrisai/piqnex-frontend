"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
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
