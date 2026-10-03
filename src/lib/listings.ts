import { apiFetch } from "@/lib/api-client";
import { SAMPLE_LISTINGS, type SampleListing } from "@/lib/sample-data";
import type { ListingCardData } from "@/components/listings/ListingCard";
import type { ConditionOption, PartSearchQuery } from "@/lib/types";
import { findExactMatches, type MatchableFields } from "@/lib/matching";

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

function sampleToCardData(listing: SampleListing): ListingCardData {
  return {
    id: listing.id,
    imageUrl: listing.imageUrl,
    brand: listing.brand,
    product: listing.product,
    model: listing.model,
    part: listing.part,
    condition: listing.condition,
    price: listing.price,
    location: listing.location,
    isSample: true,
  };
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

/** Homepage "recently listed" strip. Pads with sample data if real listings are sparse. */
export async function getHomepageListings(limit: number): Promise<ListingCardData[]> {
  try {
    const data = await apiFetch<BackendListing[]>("/listings/featured", {
      authenticated: false,
      query: { limit },
    });

    const real = data.map(backendRowToCardData);
    if (real.length >= limit) return real;

    const fillerNeeded = limit - real.length;
    return [...real, ...SAMPLE_LISTINGS.slice(0, fillerNeeded).map(sampleToCardData)];
  } catch {
    // Backend not reachable yet - fail soft to sample data rather than
    // showing a broken homepage.
    return SAMPLE_LISTINGS.slice(0, limit).map(sampleToCardData);
  }
}

export interface ListingSearchResult {
  listings: ListingCardData[];
  total: number;
  usingSampleData: boolean;
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
        page,
      },
    });

    if (result.total === 0 && page === 1) {
      const filtered = filterSampleListings(query);
      return {
        listings: filtered.map(sampleToCardData),
        total: filtered.length,
        usingSampleData: true,
      };
    }

    return {
      listings: result.items.map(backendRowToCardData),
      total: result.total,
      usingSampleData: false,
    };
  } catch {
    const filtered = filterSampleListings(query);
    return {
      listings: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(sampleToCardData),
      total: filtered.length,
      usingSampleData: true,
    };
  }
}

function filterSampleListings(query: PartSearchQuery): SampleListing[] {
  const q = query.q?.toLowerCase().trim();
  return SAMPLE_LISTINGS.filter((listing) => {
    if (query.category && listing.category !== query.category) return false;
    if (query.brand && !listing.brand.toLowerCase().includes(query.brand.toLowerCase())) return false;
    if (query.product && !listing.product.toLowerCase().includes(query.product.toLowerCase())) return false;
    if (query.part && !listing.part.toLowerCase().includes(query.part.toLowerCase())) return false;
    if (query.condition && listing.condition !== query.condition) return false;
    if (query.location && !listing.location.toLowerCase().includes(query.location.toLowerCase())) return false;
    if (query.minPrice !== undefined && listing.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && listing.price > query.maxPrice) return false;
    if (q) {
      const haystack = `${listing.brand} ${listing.product} ${listing.model} ${listing.part} ${listing.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export interface NeedMatchResult {
  matches: ListingCardData[];
  usingSampleData: boolean;
}

/**
 * Powers the "I NEED A PART" search (/need). Looks for listings whose
 * brand/product/part match exactly (see lib/matching.ts for the rule, and
 * GET /listings/match on the backend for the equivalent server-side query).
 * Sample data is always included as extra (clearly badged) results so the
 * matching flow demonstrates real behavior before you have live listings.
 */
export async function getNeedMatches(query: MatchableFields): Promise<NeedMatchResult> {
  const sampleMatches = findExactMatches(query, SAMPLE_LISTINGS).map(sampleToCardData);

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

    const real = data.map(backendRowToCardData);
    return { matches: [...real, ...sampleMatches], usingSampleData: sampleMatches.length > 0 };
  } catch {
    return { matches: sampleMatches, usingSampleData: sampleMatches.length > 0 };
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

  const sample = SAMPLE_LISTINGS.find((l) => l.id === id);
  if (!sample) return null;

  return {
    id: sample.id,
    sellerId: "sample",
    brand: sample.brand,
    product: sample.product,
    model: sample.model,
    part: sample.part,
    condition: sample.condition,
    price: sample.price,
    currency: "INR",
    description: sample.description,
    location: sample.location,
    status: "active",
    createdAt: new Date().toISOString(),
    images: sample.imageUrl ? [sample.imageUrl] : [],
    seller: null,
    isSample: true,
  };
}
