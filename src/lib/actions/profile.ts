"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiFetch, getCurrentUser } from "@/lib/api-client";
import { zodFieldErrors, type ActionState } from "./types";

const profileSchema = z.object({
  bio: z.string().trim().max(200, "Keep your bio under 200 characters").optional().or(z.literal("")),
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  // Optional, but if given it must be 10 digits with no country code
  // (matches the backend's UpdateProfileDto.phone pattern).
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit phone number")
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
    bio: formData.get("bio") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  // Only touch the photo when the user picked or removed one. It must be a small JPEG data URL.
  const avatarChanged = formData.get("avatar_changed") === "1";
  const avatar = String(formData.get("avatar") ?? "");
  if (avatarChanged && avatar && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(avatar)) {
    return { status: "error", fieldErrors: { avatar: "That photo couldn't be used. Try another image." } };
  }
  if (avatarChanged && avatar.length > 70000) {
    return { status: "error", fieldErrors: { avatar: "That photo is too large. Try a smaller image." } };
  }

  try {
    await apiFetch("/profile/me", {
      method: "PATCH",
      body: {
        displayName: parsed.data.display_name,
        location: parsed.data.location || undefined,
        phone: parsed.data.phone || undefined,
        bio: parsed.data.bio ?? "",
        ...(avatarChanged ? { avatarUrl: avatar } : {}),
      },
    });
  } catch {
    return { status: "error", message: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/settings");
  revalidatePath("/", "layout"); // refresh the name shown in the header menu
  return { status: "success", message: "Profile updated." };
}
