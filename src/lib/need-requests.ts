import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { findExactMatches, type MatchableFields } from "@/lib/matching";
import type { NeedRequest } from "@/lib/types";

/**
 * After a seller publishes a listing, we show them any OPEN need requests
 * that exactly match it - "3 people are looking for exactly this part."
 * This is what closes the loop from the "I NEED" side back to a new listing.
 */
export async function getOpenNeedRequestMatches(fields: MatchableFields): Promise<NeedRequest[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    let db = supabase
      .from("need_requests")
      .select("*")
      .eq("status", "open")
      .ilike("brand_name", fields.brand)
      .ilike("product_name", fields.product)
      .ilike("part_name", fields.part);

    if (fields.model) db = db.ilike("model_label", fields.model);

    const { data, error } = await db.order("created_at", { ascending: false }).limit(10);
    if (error || !data) return [];

    const rows = data as NeedRequest[];
    // findExactMatches expects { brand, product, model, part } - map each row
    // to that shape for comparison, then return the matching original rows.
    const matches = findExactMatches(
      fields,
      rows.map((row) => ({
        row,
        brand: row.brand_name,
        product: row.product_name,
        model: row.model_label,
        part: row.part_name,
      }))
    );
    return matches.map((m) => m.row);
  } catch {
    return [];
  }
}
