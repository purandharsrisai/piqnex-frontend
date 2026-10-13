"use server";

import { z } from "zod";
import { apiFetch } from "@/lib/api-client";
import { zodFieldErrors, type ActionState } from "./types";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  topic: z.enum(["account", "listing", "report", "feedback", "other"], {
    errorMap: () => ({ message: "Choose a topic" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(2000, "Please keep it under 2000 characters"),
});

export async function sendContactMessageAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/support/contact", {
      method: "POST",
      authenticated: false,
      body: { ...parsed.data, website: formData.get("website") ?? "" },
    });
  } catch {
    return {
      status: "error",
      message: "We couldn't send your message. Please try again in a moment.",
    };
  }

  return { status: "success", message: "Thanks! Your message is on its way - we usually reply within 2 business days." };
}
