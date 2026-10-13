"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import { contactRequestSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

export async function createContactRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const listingId = String(formData.get("listingId") ?? "");

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/parts/${listingId}`)}`);
  }

  const parsed = contactRequestSchema.safeParse({
    message: formData.get("message"),
    contact_info: formData.get("contact_info") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  let sellerId: string;
  try {
    const listing = await apiFetch<{ sellerId: string }>(`/listings/${listingId}`, {
      authenticated: false,
    });
    sellerId = listing.sellerId;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { status: "error", message: "This listing no longer exists." };
    }
    return { status: "error", message: "We couldn't send your message. Please try again." };
  }

  if (sellerId === user.id) {
    return { status: "error", message: "You can't contact yourself about your own listing." };
  }

  try {
    await apiFetch(`/listings/${listingId}/contact`, {
      method: "POST",
      body: {
        message: parsed.data.message,
        contactInfo: parsed.data.contact_info || undefined,
      },
    });
  } catch {
    return { status: "error", message: "We couldn't send your message. Please try again." };
  }

  return {
    status: "success",
    message: "Message sent! The seller will see your contact details and can reach out.",
  };
}
