"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiFetch, getCurrentUser } from "@/lib/api-client";
import { zodFieldErrors, type ActionState } from "./types";

const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  // Loosely validated - international phone formats vary (spaces, dashes,
  // parens, a leading +). This just catches obvious junk input, matching
  // the backend's UpdateProfileDto.phone pattern.
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+()\-\s]{6,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    location: formData.get("location") ?? "",
    phone: formData.get("phone") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/profile/me", {
      method: "PATCH",
      body: {
        displayName: parsed.data.display_name,
        location: parsed.data.location || undefined,
        phone: parsed.data.phone || undefined,
      },
    });
  } catch {
    return { status: "error", message: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/profile");
  return { status: "success", message: "Profile updated." };
}
