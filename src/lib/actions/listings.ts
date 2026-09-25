"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listingSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

const NOT_CONFIGURED_MESSAGE =
  "Supabase isn't connected yet, so listings can't be saved. Add your project credentials to .env.local first.";

export async function createListingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.category)
    .maybeSingle();

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      seller_id: user.id,
      category_id: category?.id ?? null,
      brand_name: parsed.data.brand,
      product_name: parsed.data.product,
      model_label: parsed.data.model || null,
      part_name: parsed.data.part,
      condition: parsed.data.condition,
      price: parsed.data.price,
      description: parsed.data.description,
      location: parsed.data.location || null,
    })
    .select("id")
    .single();

  if (error || !listing) {
    return {
      status: "error",
      message: "We couldn't publish your listing just now. Please try again.",
    };
  }

  // Photos are optional. Upload whatever real files were attached (browsers
  // include an empty File with size 0 when no file was chosen for an input,
  // so we filter those out).
  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 6);

  for (const [index, file] of files.entries()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${user.id}/${listing.id}/${index}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(path, file, { contentType: file.type || undefined });

    if (!uploadError) {
      await supabase.from("listing_images").insert({
        listing_id: listing.id,
        storage_path: path,
        sort_order: index,
      });
    }
    // If a single photo fails to upload, we deliberately don't fail the whole
    // listing - the part is still published, just with fewer photos.
  }

  revalidatePath("/browse");
  revalidatePath("/");
  redirect(`/parts/${listing.id}?created=1`);
}

export async function updateListingStatusAction(listingId: string, status: "active" | "sold" | "removed") {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("listings").update({ status }).eq("id", listingId).eq("seller_id", user.id);
  revalidatePath("/profile");
  revalidatePath(`/parts/${listingId}`);
  revalidatePath("/browse");
}

export async function deleteListingAction(listingId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS also enforces this, but checking seller_id here gives a clearer
  // failure mode than a silently-ignored delete.
  await supabase.from("listings").delete().eq("id", listingId).eq("seller_id", user.id);
  revalidatePath("/profile");
  revalidatePath("/browse");
}
