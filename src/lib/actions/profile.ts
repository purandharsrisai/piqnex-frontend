"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { zodFieldErrors, type ActionState } from "./types";
import { z } from "zod";

const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase isn't connected yet." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    location: formData.get("location") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      location: parsed.data.location || null,
    })
    .eq("id", user.id);

  if (error) {
    return { status: "error", message: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Profile updated." };
}
