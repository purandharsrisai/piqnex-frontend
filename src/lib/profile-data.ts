import { createClient } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/listings";
import type { ConditionOption, ListingStatus, NeedRequestStatus } from "@/lib/types";

export interface MyListing {
  id: string;
  brand: string;
  product: string;
  model: string | null;
  part: string;
  condition: ConditionOption;
  price: number;
  status: ListingStatus;
  imageUrl: string | null;
  createdAt: string;
}

export interface MyNeedRequest {
  id: string;
  brand: string;
  product: string;
  model: string | null;
  part: string;
  status: NeedRequestStatus;
  createdAt: string;
}

/** All of the current user's listings, any status - used on /profile. */
export async function getMyListings(userId: string): Promise<MyListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `id, brand_name, product_name, model_label, part_name, condition, price, status, created_at,
       listing_images ( storage_path, sort_order )`
    )
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => {
    const images = [...(row.listing_images ?? [])].sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    );
    return {
      id: row.id,
      brand: row.brand_name,
      product: row.product_name,
      model: row.model_label,
      part: row.part_name,
      condition: row.condition,
      price: Number(row.price),
      status: row.status,
      imageUrl: images[0] ? publicImageUrl(images[0].storage_path) : null,
      createdAt: row.created_at,
    };
  });
}

export async function getMyNeedRequests(userId: string): Promise<MyNeedRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("need_requests")
    .select("id, brand_name, product_name, model_label, part_name, status, created_at")
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    brand: row.brand_name,
    product: row.product_name,
    model: row.model_label,
    part: row.part_name,
    status: row.status,
    createdAt: row.created_at,
  }));
}
