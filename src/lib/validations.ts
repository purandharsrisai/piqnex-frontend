import { z } from "zod";
import { CONDITION_OPTIONS } from "./types";

/**
 * Shared validation schemas (Zod). We reuse the SAME schema on the client
 * (for instant form feedback) and on the server/route handler (because
 * client-side validation can always be bypassed - never trust the browser).
 */

export const needRequestSchema = z.object({
  category: z.string().min(1, "Please choose a category"),
  brand: z.string().trim().min(1, "Brand is required").max(80),
  product: z.string().trim().min(1, "Product is required").max(120),
  model: z.string().trim().max(120).optional().or(z.literal("")),
  part: z.string().trim().min(1, "Tell us which part is missing").max(120),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});
export type NeedRequestInput = z.infer<typeof needRequestSchema>;

export const listingSchema = z.object({
  category: z.string().min(1, "Please choose a category"),
  brand: z.string().trim().min(1, "Brand is required").max(80),
  product: z.string().trim().min(1, "Product is required").max(120),
  model: z.string().trim().max(120).optional().or(z.literal("")),
  part: z.string().trim().min(1, "Part/component name is required").max(120),
  condition: z.enum(CONDITION_OPTIONS as [string, ...string[]]),
  price: z.coerce
    .number({ invalid_type_error: "Enter a valid price" })
    .min(0, "Price can't be negative")
    .max(10_000_000, "That price looks too high"),
  description: z
    .string()
    .trim()
    .min(10, "Add a few words describing the part's condition and history")
    .max(1500),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});
export type ListingInput = z.infer<typeof listingSchema>;

export const contactRequestSchema = z.object({
  message: z.string().trim().min(5, "Write a short message to the seller").max(1000),
  contact_info: z.string().trim().max(200).optional().or(z.literal("")),
});
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type AuthInput = z.infer<typeof authSchema>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug is required")
    .max(80)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(1, "Name is required").max(120),
  icon: z.string().trim().max(80).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).max(1000).optional(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug is required")
    .max(80)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().trim().min(1, "Name is required").max(120),
  category_id: z.string().uuid("Choose a category"),
});
export type BrandInput = z.infer<typeof brandSchema>;
