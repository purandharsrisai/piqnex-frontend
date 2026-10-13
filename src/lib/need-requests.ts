import { apiFetch } from "@/lib/api-client";
import { findExactMatches, type MatchableFields } from "@/lib/matching";
import type { NeedRequest } from "@/lib/types";

interface BackendNeedRequest {
  id: string;
  requesterId: string;
  categoryId: string | null;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  description: string | null;
  location: string | null;
  status: "open" | "matched" | "closed";
  createdAt: string;
}

function toNeedRequest(row: BackendNeedRequest): NeedRequest {
  return {
    id: row.id,
    requester_id: row.requesterId,
    category_id: row.categoryId,
    brand_name: row.brandName,
    product_name: row.productName,
    model_label: row.modelLabel,
    part_name: row.partName,
    description: row.description,
    location: row.location,
    status: row.status,
    created_at: row.createdAt,
  };
}

/**
 * After a seller publishes a listing, we show them any OPEN need requests
 * that exactly match it - "3 people are looking for exactly this part."
 * This is what closes the loop from the "I NEED" side back to a new listing.
 * Backed by GET /need-requests/match (see NeedRequestsService.getOpenMatches),
 * which already does the exact-match filtering server-side.
 */
export async function getOpenNeedRequestMatches(fields: MatchableFields): Promise<NeedRequest[]> {
  try {
    const rows = await apiFetch<BackendNeedRequest[]>("/need-requests/match", {
      authenticated: false,
      query: {
        brandName: fields.brand,
        productName: fields.product,
        modelLabel: fields.model ?? undefined,
        partName: fields.part,
      },
    });

    const matches = findExactMatches(
      fields,
      rows.map((row) => ({
        row,
        brand: row.brandName,
        product: row.productName,
        model: row.modelLabel,
        part: row.partName,
      })),
    );
    return matches.map((m) => toNeedRequest(m.row));
  } catch {
    return [];
  }
}
