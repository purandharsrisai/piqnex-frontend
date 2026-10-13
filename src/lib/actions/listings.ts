"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, getCurrentUser } from "@/lib/api-client";
import { z } from "zod";
import { CONDITION_OPTIONS } from "@/lib/types";
import { listingSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

interface CreatedListing {
  id: string;
}

interface Category {
  id: string;
  slug: string;
}

export async function createListingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent("/sell")}`);
  }

  const raw = {
    category: formData.get("category"),
    brand: formData.get("brand"),
    product: formData.get("product"),
    model: formData.get("model") ?? "",
    part: formData.get("part"),
    condition: formData.get("condition"),
    price: formData.get("price"),
    description: formData.get("description"),
    location: formData.get("location") ?? "",
  };

  const parsed = listingSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  // The structured catalog (categories/brands/products) starts nearly
  // empty - most listings are free text only (brandName/productName/etc on
  // the Listing itself). We still look up categoryId when the slug happens
  // to match a real category.
  let categoryId: string | undefined;
  try {
    const categories = await apiFetch<Category[]>("/catalog/categories", { authenticated: false });
    categoryId = categories.find((c) => c.slug === parsed.data.category)?.id;
  } catch {
    categoryId = undefined;
  }

  // Photos are optional, and piqnex-backend's upload endpoint isn't wired up
  // to real storage yet (see UploadsService - it's an intentional stub
  // until S3/R2 credentials are added). We still try, but a failure here
  // never blocks publishing the listing itself - a part with fewer
  // photos is still published.
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 6);
  const imagePaths: string[] = [];
  for (const file of files) {
    try {
      const uploaded = await apiFetch<{ storagePath: string }>("/uploads/listing-image", {
        method: "POST",
        body: { filename: file.name, contentType: file.type },
      });
      if (uploaded?.storagePath) imagePaths.push(uploaded.storagePath);
    } catch {
      // Upload storage isn't configured yet - skip this photo, don't fail the listing.
    }
  }

  let listing: CreatedListing;
  try {
    listing = await apiFetch<CreatedListing>("/listings", {
      method: "POST",
      body: {
        categoryId,
        brandName: parsed.data.brand,
        productName: parsed.data.product,
        modelLabel: parsed.data.model || undefined,
        partName: parsed.data.part,
        condition: parsed.data.condition,
        price: parsed.data.price,
        description: parsed.data.description,
        location: parsed.data.location || undefined,
        imagePaths: imagePaths.length ? imagePaths : undefined,
      },
    });
  } catch {
    return {
      status: "error",
      message: "We couldn't publish your listing just now. Please try again.",
    };
  }

  revalidatePath("/browse");
  revalidatePath("/");
  redirect(`/parts/${listing.id}?created=1`);
}

export async function updateListingStatusAction(listingId: string, status: "active" | "sold" | "removed") {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await apiFetch(`/listings/${listingId}/status`, { method: "PATCH", body: { status } });
  } catch {
    // Ownership/not-found errors from the backend are deliberately silent here.
  }

  revalidatePath("/profile");
  revalidatePath("/my-listings");
  revalidatePath("/my-requests");
  revalidatePath(`/parts/${listingId}`);
  revalidatePath("/browse");
  revalidatePath("/");
}

export async function deleteListingAction(listingId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await apiFetch(`/listings/${listingId}`, { method: "DELETE" });
  } catch {
    // Same fire-and-forget behavior as updateListingStatusAction above.
  }

  revalidatePath("/profile");
  revalidatePath("/my-listings");
  revalidatePath("/my-requests");
  revalidatePath("/browse");
  revalidatePath("/");
}

const editSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(120),
  product: z.string().trim().min(1, "Product is required").max(120),
  model: z.string().trim().max(120).optional().or(z.literal("")),
  part: z.string().trim().min(1, "Part is required").max(120),
  condition: z.enum(CONDITION_OPTIONS as unknown as [string, ...string[]], { message: "Choose a condition" }),
  price: z.coerce.number({ message: "Enter a price" }).min(0, "Price can't be negative"),
  description: z.string().trim().min(10, "Add a few words describing the part's condition and history").max(2000),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function updateListingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("listingId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=${encodeURIComponent(`/parts/${id}/edit`)}`);

  const parsed = editSchema.safeParse({
    brand: formData.get("brand"),
    product: formData.get("product"),
    model: formData.get("model") ?? "",
    part: formData.get("part"),
    condition: formData.get("condition"),
    price: formData.get("price"),
    description: formData.get("description"),
    location: formData.get("location") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: zodFieldErrors(parsed.error) };
  }

  try {
    await apiFetch(`/listings/${id}`, {
      method: "PATCH",
      body: {
        brandName: parsed.data.brand,
        productName: parsed.data.product,
        modelLabel: parsed.data.model || "",
        partName: parsed.data.part,
        condition: parsed.data.condition,
        price: parsed.data.price,
        description: parsed.data.description,
        location: parsed.data.location || "",
      },
    });
  } catch {
    return { status: "error", message: "We couldn't save your changes. Please try again." };
  }

  revalidatePath(`/parts/${id}`);
  revalidatePath("/browse");
  revalidatePath("/profile");
  revalidatePath("/my-listings");
  revalidatePath("/my-requests");
  revalidatePath("/");
  redirect(`/parts/${id}?updated=1`);
}
