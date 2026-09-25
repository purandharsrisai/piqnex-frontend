"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { categorySchema, brandSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";
import type { ListingStatus, NeedRequestStatus } from "@/lib/types";

const NOT_CONFIGURED_MESSAGE =
  "The admin service role isn't configured yet. Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the dev server.";

/**
 * Every admin Server Action calls this first. Server Actions can be invoked
 * directly (not just through the /admin pages), so this re-checks is_admin
 * independently of the /admin layout's page-level gate - the same defense-
 * in-depth reasoning the existing listings actions already use when they
 * re-check `seller_id` even though RLS also enforces it.
 */
async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) redirect("/");

  return user;
}

/** True when a Postgres error is a foreign-key violation (code 23503). */
function isForeignKeyViolation(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && (error as { code?: string }).code === "23503");
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export async function adminSetListingStatusAction(listingId: string, status: ListingStatus) {
  await requireAdmin();
  if (!isAdminConfigured()) return;

  const admin = createAdminClient();
  await admin.from("listings").update({ status }).eq("id", listingId);

  revalidatePath("/admin/listings");
  revalidatePath("/browse");
  revalidatePath("/");
  revalidatePath(`/parts/${listingId}`);
}

// ---------------------------------------------------------------------------
// Need requests
// ---------------------------------------------------------------------------

export async function adminSetNeedRequestStatusAction(id: string, status: NeedRequestStatus) {
  await requireAdmin();
  if (!isAdminConfigured()) return;

  const admin = createAdminClient();
  await admin.from("need_requests").update({ status }).eq("id", id);

  revalidatePath("/admin/need-requests");
}

export async function adminDeleteNeedRequestAction(id: string) {
  await requireAdmin();
  if (!isAdminConfigured()) return;

  const admin = createAdminClient();
  await admin.from("need_requests").delete().eq("id", id);

  revalidatePath("/admin/need-requests");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function adminCreateCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isAdminConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const parsed = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    icon: formData.get("icon") ?? "",
    sort_order: formData.get("sort_order") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("categories").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    icon: parsed.data.icon || null,
    sort_order: parsed.data.sort_order ?? 0,
  });

  if (error) {
    const message = error.message.toLowerCase().includes("duplicate")
      ? "That slug is already used by another category."
      : "We couldn't create that category. Please try again.";
    return { status: "error", message };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Category created." };
}

export async function adminDeleteCategoryAction(categoryId: string): Promise<ActionState> {
  await requireAdmin();
  if (!isAdminConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("categories").delete().eq("id", categoryId);

  if (error) {
    if (isForeignKeyViolation(error)) {
      return {
        status: "error",
        message: "This category is still in use by existing products and can't be deleted.",
      };
    }
    return { status: "error", message: "We couldn't delete that category. Please try again." };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Category deleted." };
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function adminCreateBrandAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  if (!isAdminConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const parsed = brandSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category_id: formData.get("category_id"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("brands").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    category_id: parsed.data.category_id,
  });

  if (error) {
    const message = error.message.toLowerCase().includes("duplicate")
      ? "That slug is already used by another brand."
      : "We couldn't create that brand. Please try again.";
    return { status: "error", message };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Brand created." };
}

export async function adminDeleteBrandAction(brandId: string): Promise<ActionState> {
  await requireAdmin();
  if (!isAdminConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("brands").delete().eq("id", brandId);

  if (error) {
    if (isForeignKeyViolation(error)) {
      return {
        status: "error",
        message: "This brand is still in use by existing products and can't be deleted.",
      };
    }
    return { status: "error", message: "We couldn't delete that brand. Please try again." };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Brand deleted." };
}
