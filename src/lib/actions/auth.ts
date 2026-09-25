"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { authSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

const NOT_CONFIGURED_MESSAGE =
  "Supabase isn't connected yet. Add your project URL and anon key to .env.local (see .env.example), then restart the dev server.";

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: displayName || undefined } },
  });

  if (error) {
    return { status: "error", message: humanizeAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: humanizeAuthError(error.message) };
  }

  const redirectTo = String(formData.get("redirectTo") ?? "/profile");
  revalidatePath("/", "layout");
  redirect(redirectTo || "/profile");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

/** Converts raw Supabase auth error text into something a normal user understands. */
function humanizeAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("already registered")) {
    return "That email is already registered. Try logging in instead.";
  }
  if (lower.includes("invalid login credentials")) {
    return "That email or password doesn't match our records.";
  }
  if (lower.includes("password")) {
    return "Password must be at least 6 characters.";
  }
  if (lower.includes("email")) {
    return "Please enter a valid email address.";
  }
  return "Something went wrong. Please try again.";
}
