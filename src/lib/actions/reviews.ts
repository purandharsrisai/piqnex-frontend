"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import type { ActionState } from "./types";

export async function createReviewAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const listingId = String(formData.get("listingId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=${encodeURIComponent(`/parts/${listingId}`)}`);

  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Choose a rating from 1 to 5 stars." };
  }
  if (comment.length > 1000) return { status: "error", message: "Review is too long (1000 max)." };

  try {
    await apiFetch(`/listings/${listingId}/reviews`, { method: "POST", body: { rating, comment } });
  } catch (e) {
    return {
      status: "error",
      message: e instanceof ApiError && e.status < 500 ? e.message : "Couldn't save your review. Please try again.",
    };
  }
  // No revalidatePath here on purpose: re-rendering the page would unmount the
  // form (the buyer can no longer review) before the thank-you message shows.
  // The page is dynamic, so the next visit already reflects the new review.
  return { status: "success", message: "Thanks - your review is live." };
}
