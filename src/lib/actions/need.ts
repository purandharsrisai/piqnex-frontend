"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { needRequestSchema } from "@/lib/validations";
import { zodFieldErrors, type ActionState } from "./types";

export async function createNeedRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Supabase isn't connected yet, so we can't save need requests. Add your project credentials to .env.local first.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parsed.data.category)
    .maybeSingle();

  const { error } = await supabase.from("need_requests").insert({
    requester_id: user.id,
    category_id: category?.id ?? null,
    brand_name: parsed.data.brand,
    product_name: parsed.data.product,
    model_label: parsed.data.model || null,
    part_name: parsed.data.part,
    description: parsed.data.description || null,
    location: parsed.data.location || null,
  });

  if (error) {
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
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("need_requests")
    .update({ status: "closed" })
    .eq("id", requestId)
    .eq("requester_id", user.id);
  revalidatePath("/profile");
}

export async function deleteNeedRequestAction(requestId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("need_requests").delete().eq("id", requestId).eq("requester_id", user.id);
  revalidatePath("/profile");
}
