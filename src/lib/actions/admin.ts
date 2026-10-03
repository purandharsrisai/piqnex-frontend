"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiError, getCurrentUser } from "@/lib/api-client";
import { categorySchema, brandSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";
import type { ListingStatus, NeedRequestStatus } from "@/lib/types";

/**
 * Every admin Server Action calls this first. Server Actions can be invoked
 * directly (not just through the /admin pages), so this re-checks isAdmin
 * independently of the /admin layout's page-level gate - the backend's
 * AdminController (JwtAuthGuard + AdminGuard on every route) is still the
 * real authorization boundary; this is just a friendlier redirect than a
 * raw 403 would be.
 */
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/admin");
  if (!user.isAdmin) redirect("/");
  return user;
}

function isConflict(error: unknown): boolean {
  return error instanceof ApiError && error.status === 409;
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export async function adminSetListingStatusAction(listingId: string, status: ListingStatus) {
  await requireAdmin();

  await apiFetch(`/admin/listings/${listingId}/status`, { method: "PATCH", body: { status } });

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

  await apiFetch(`/admin/need-requests/${id}/status`, { method: "PATCH", body: { status } });

  revalidatePath("/admin/need-requests");
}

export async function adminDeleteNeedRequestAction(id: string) {
  await requireAdmin();

  await apiFetch(`/admin/need-requests/${id}`, { method: "DELETE" });

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

  const parsed = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    icon: formData.get("icon") ?? "",
    sort_order: formData.get("sort_order") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/admin/categories", {
      method: "POST",
      body: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        icon: parsed.data.icon || undefined,
        sortOrder: parsed.data.sort_order ?? 0,
      },
    });
  } catch (error) {
    const message = isConflict(error)
      ? "That slug is already used by another category."
      : "We couldn't create that category. Please try again.";
    return { status: "error", message };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Category created." };
}

export async function adminDeleteCategoryAction(categoryId: string): Promise<ActionState> {
  await requireAdmin();

  try {
    await apiFetch(`/admin/categories/${categoryId}`, { method: "DELETE" });
  } catch (error) {
    if (isConflict(error)) {
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

  const parsed = brandSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    category_id: formData.get("category_id"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch("/admin/brands", {
      method: "POST",
      body: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        categoryId: parsed.data.category_id,
      },
    });
  } catch (error) {
    const message = isConflict(error)
      ? "That slug is already used by another brand."
      : "We couldn't create that brand. Please try again.";
    return { status: "error", message };
  }

  revalidatePath("/admin/catalog");
  return { status: "success", message: "Brand created." };
}

export async function adminDeleteBrandAction(brandId: string): Promise<ActionState> {
  await requireAdmin();

  try {
    await apiFetch(`/admin/brands/${brandId}`, { method: "DELETE" });
  } catch (error) {
    if (isConflict(error)) {
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
