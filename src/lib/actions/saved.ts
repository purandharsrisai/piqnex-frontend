"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api-client";

/** Returns true on success, false on failure (caller reverts its optimistic state). */
export async function toggleSavedAction(listingId: string, save: boolean): Promise<boolean> {
  try {
    await apiFetch(`/saved/${listingId}`, { method: save ? "POST" : "DELETE" });
  } catch {
    return false;
  }
  revalidatePath("/saved");
  return true;
}
