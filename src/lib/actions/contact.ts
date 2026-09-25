"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { contactRequestSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

export async function createContactRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const listingId = String(formData.get("listingId") ?? "");

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase isn't connected yet, so messages can't be sent. Add your project credentials to .env.local first.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: listing } = await supabase
    .from("listings")
    .select("seller_id")
    .eq("id", listingId)
    .maybeSingle();

  if (!listing) {
    return { status: "error", message: "This listing no longer exists." };
  }
  if (listing.seller_id === user.id) {
    return { status: "error", message: "You can't contact yourself about your own listing." };
  }

  const { error } = await supabase.from("contact_requests").insert({
    listing_id: listingId,
    buyer_id: user.id,
    message: parsed.data.message,
    contact_info: parsed.data.contact_info || null,
  });

  if (error) {
    return { status: "error", message: "We couldn't send your message. Please try again." };
  }

  return {
    status: "success",
    message: "Message sent! The seller will see your contact details and can reach out.",
  };
}
