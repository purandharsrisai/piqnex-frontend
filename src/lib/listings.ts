import { apiFetch } from "@/lib/api-client";
import type { ListingCardData } from "@/components/listings/ListingCard";
import type { ConditionOption, PartSearchQuery } from "@/lib/types";
import type { MatchableFields } from "@/lib/matching";

/**
 * Data-access layer for listings - now calling piqnex-backend (NestJS +
 * Prisma) instead of Supabase directly. Centralizing the API calls here
 * (instead of calling apiFetch from every page) means:
 *  1. Pages stay focused on layout/markup, not query logic.
 *  2. We have one place to fall back to sample data when the backend isn't
 *     reachable yet, or simply has no real listings - the same "fail soft to
 *     sample data" UX the old Supabase version had for "not configured yet".
 */

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Builds a displayable URL for an uploaded listing image's storage path. */
export function publicImageUrl(storagePath: string): string | null {
  if (!storagePath) return null;
  if (/^https?:\/\//.test(storagePath)) return storagePath;
  return `${API_URL}/uploads/${storagePath}`;
}

interface BackendListingImage {
  storagePath: string;
  sortOrder: number;
}

interface BackendListing {
  id: string;
  sellerId: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  condition: ConditionOption;
  price: number | string;
  currency: string;
  description: string;
  location: string | null;
  status: string;
  createdAt: string;
  images: BackendListingImage[];
  seller?: { id: string; displayName: string; location: string | null } | null;
}

function backendRowToCardData(row: BackendListing): ListingCardData {
  const images = [...(row.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: row.id,
    imageUrl: images[0] ? publicImageUrl(images[0].storagePath) : null,
    brand: row.brandName,
    product: row.productName,
    model: row.modelLabel,
    part: row.partName,
    condition: row.condition,
    price: Number(row.price),
    location: row.location,
    isSample: false,
  };
}

/** Homepage "recently listed" strip - real listings only (empty until people post). */
export async function getHomepageListings(limit: number): Promise<ListingCardData[]> {
  try {
    const data = await apiFetch<BackendListing[]>("/listings/featured", {
      authenticated: false,
      query: { limit },
    });
    return data.map(backendRowToCardData);
  } catch {
    return [];
  }
}

export interface ListingSearchResult {
  listings: ListingCardData[];
  total: number;
}

const PAGE_SIZE = 12;

/**
 * Powers /browse: full filterable, paginated search.
 *
 * NOTE: piqnex-backend's GET /listings only filters `brand` by the
 * structured catalog's brand SLUG (most listings don't have one yet - see
 * CreateListingDto) and has no separate product/model/part filters, unlike
 * the old Supabase version's free-text ilike on each column. We fold the
 * free-text brand/product/model/part/q inputs from the search form into a
 * single `q`, which the backend already matches (case-insensitively) across
 * brandName/productName/modelLabel/partName/description - see
 * ListingsService.search().
 */
export async function searchListings(query: PartSearchQuery): Promise<ListingSearchResult> {
  const page = query.page ?? 1;

  const freeText = [query.brand, query.product, query.model, query.part, query.q]
    .filter((v): v is string => Boolean(v && v.trim()))
    .join(" ")
    .trim();

  try {
    const result = await apiFetch<{ items: BackendListing[]; total: number }>("/listings", {
      authenticated: false,
      query: {
        category: query.category,
        condition: query.condition,
        location: query.location,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        q: freeText || undefined,
        sort: query.sort,
        page,
      },
    });

    return {
      listings: result.items.map(backendRowToCardData),
      total: result.total,
    };
  } catch {
    return { listings: [], total: 0 };
  }
}

export interface NeedMatchResult {
  matches: ListingCardData[];
}

/**
 * Powers the "I NEED A PART" search (/need). Looks for listings whose
 * brand/product/part match exactly (see lib/matching.ts for the rule, and
 * GET /listings/match on the backend for the equivalent server-side query).
 * Sample data is always included as extra (clearly badged) results so the
 * matching flow demonstrates real behavior before you have live listings.
 */
export async function getNeedMatches(query: MatchableFields): Promise<NeedMatchResult> {
  try {
    const data = await apiFetch<BackendListing[]>("/listings/match", {
      authenticated: false,
      query: {
        brandName: query.brand,
        productName: query.product,
        modelLabel: query.model ?? undefined,
        partName: query.part,
      },
    });
    return { matches: data.map(backendRowToCardData) };
  } catch {
    return { matches: [] };
  }
}

export interface ListingDetail {
  id: string;
  sellerId: string;
  brand: string;
  product: string;
  model: string | null;
  part: string;
  condition: ConditionOption;
  price: number;
  currency: string;
  description: string;
  location: string | null;
  status: string;
  createdAt: string;
  images: string[]; // public URLs, already sorted
  seller: { displayName: string; location: string | null } | null;
  isSample: boolean;
}

/** Powers /parts/[id]. Checks the real backend first, falls back to sample data by id. */
export async function getListingDetail(id: string): Promise<ListingDetail | null> {
  try {
    const row = await apiFetch<BackendListing>(`/listings/${id}`, { authenticated: false });

    const images = [...(row.images ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => publicImageUrl(img.storagePath))
      .filter((url): url is string => Boolean(url));

    return {
      id: row.id,
      sellerId: row.sellerId,
      brand: row.brandName,
      product: row.productName,
      model: row.modelLabel,
      part: row.partName,
      condition: row.condition,
      price: Number(row.price),
      currency: row.currency,
      description: row.description,
      location: row.location,
      status: row.status,
      createdAt: row.createdAt,
      images,
      seller: row.seller ? { displayName: row.seller.displayName, location: row.seller.location } : null,
      isSample: false,
    };
  } catch {
    // 404 (or the backend being unreachable) falls through to the sample
    // lookup below, same fail-soft behavior as the old Supabase version.
  }

  return null;
}

/** Ids of the signed-in user's saved listings (empty when logged out). */
export async function getSavedIds(): Promise<string[]> {
  try {
    return await apiFetch<string[]>("/saved/ids");
  } catch {
    return [];
  }
}

/** The signed-in user's saved listings, newest first. */
export async function getSavedListings(): Promise<ListingCardData[]> {
  try {
    const rows = await apiFetch<BackendListing[]>("/saved");
    return rows.map(backendRowToCardData);
  } catch {
    return [];
  }
}
