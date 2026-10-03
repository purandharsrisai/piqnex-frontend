"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, getCurrentUser } from "@/lib/api-client";
import { needRequestSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

interface Category {
  id: string;
  slug: string;
}

export async function createNeedRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent("/need")}`);
  }

  const raw = {
    category: formData.get("category"),
    brand: formData.get("brand"),
    product: formData.get("product"),
    model: formData.get("model") ?? "",
    part: formData.get("part"),
    description: formData.get("description") ?? "",
    location: formData.get("location") ?? "",
  };

  const parsed = needRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  let categoryId: string | undefined;
  try {
    const categories = await apiFetch<Category[]>("/catalog/categories", { authenticated: false });
    categoryId = categories.find((c) => c.slug === parsed.data.category)?.id;
  } catch {
    categoryId = undefined;
  }

  try {
    await apiFetch("/need-requests", {
      method: "POST",
      body: {
        categoryId,
        brandName: parsed.data.brand,
        productName: parsed.data.product,
        modelLabel: parsed.data.model || undefined,
        partName: parsed.data.part,
        description: parsed.data.description || undefined,
        location: parsed.data.location || undefined,
      },
    });
  } catch {
    return {
      status: "error",
      message: "We couldn't save your request just now. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Your request is saved. We'll show it to sellers who list a matching part, and you can browse again anytime.",
  };
}

export async function closeNeedRequestAction(requestId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await apiFetch(`/need-requests/${requestId}/status`, {
      method: "PATCH",
      body: { status: "closed" },
    });
  } catch {
    // Fire-and-forget, same as the old Supabase version.
  }
  revalidatePath("/profile");
}

export async function deleteNeedRequestAction(requestId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await apiFetch(`/need-requests/${requestId}`, { method: "DELETE" });
  } catch {
    // Fire-and-forget, same as the old Supabase version.
  }
  revalidatePath("/profile");
}
