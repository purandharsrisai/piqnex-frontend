import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SAMPLE_LISTINGS, type SampleListing } from "@/lib/sample-data";
import type { ListingCardData } from "@/components/listings/ListingCard";
import type { ConditionOption, PartSearchQuery } from "@/lib/types";
import { findExactMatches, type MatchableFields } from "@/lib/matching";

/**
 * Data-access layer for listings. Centralizing the Supabase queries here
 * (instead of calling supabase directly from every page) means:
 *  1. Pages stay focused on layout/markup, not query logic.
 *  2. We have one place to fall back to sample data when Supabase isn't
 *     configured yet (e.g. you're exploring this project before creating a
 *     Supabase account) or simply has no real listings yet.
 */

export { isSupabaseConfigured };

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

interface DbListingRow {
  id: string;
  brand_name: string;
  product_name: string;
  model_label: string | null;
  part_name: string;
  condition: ConditionOption;
  price: number;
  location: string | null;
  listing_images: { storage_path: string; sort_order: number }[];
}

function dbRowToCardData(row: DbListingRow): ListingCardData {
  const images = [...(row.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return {
    id: row.id,
    imageUrl: images[0] ? publicImageUrl(images[0].storage_path) : null,
    brand: row.brand_name,
    product: row.product_name,
    model: row.model_label,
    part: row.part_name,
    condition: row.condition,
    price: Number(row.price),
    location: row.location,
    isSample: false,
  };
}

/** Builds the public URL for a file stored in the "listing-images" bucket. */
export function publicImageUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/listing-images/${storagePath}`;
}

const LISTING_SELECT = `
  id, brand_name, product_name, model_label, part_name, condition, price, location,
  listing_images ( storage_path, sort_order )
`;

/** Homepage "recently listed" strip. Pads with sample data if real listings are sparse. */
export async function getHomepageListings(limit: number): Promise<ListingCardData[]> {
  if (!isSupabaseConfigured()) {
    return SAMPLE_LISTINGS.slice(0, limit).map(sampleToCardData);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const real = (data as DbListingRow[] | null)?.map(dbRowToCardData) ?? [];
    if (real.length >= limit) return real;

    const fillerNeeded = limit - real.length;
    return [...real, ...SAMPLE_LISTINGS.slice(0, fillerNeeded).map(sampleToCardData)];
  } catch {
    // Supabase not reachable / table not migrated yet - fail soft to sample data
    // rather than showing a broken homepage.
    return SAMPLE_LISTINGS.slice(0, limit).map(sampleToCardData);
  }
}

export interface ListingSearchResult {
  listings: ListingCardData[];
  total: number;
  usingSampleData: boolean;
}

const PAGE_SIZE = 12;

/** Powers /browse: full filterable, paginated search. */
export async function searchListings(query: PartSearchQuery): Promise<ListingSearchResult> {
  const page = query.page ?? 1;

  if (!isSupabaseConfigured()) {
    const filtered = filterSampleListings(query);
    return {
      listings: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(sampleToCardData),
      total: filtered.length,
      usingSampleData: true,
    };
  }

  try {
    const supabase = await createClient();
    let db = supabase
      .from("listings")
      .select(LISTING_SELECT, { count: "exact" })
      .eq("status", "active");

    if (query.brand) db = db.ilike("brand_name", `%${query.brand}%`);
    if (query.product) db = db.ilike("product_name", `%${query.product}%`);
    if (query.model) db = db.ilike("model_label", `%${query.model}%`);
    if (query.part) db = db.ilike("part_name", `%${query.part}%`);
    if (query.condition) db = db.eq("condition", query.condition);
    if (query.location) db = db.ilike("location", `%${query.location}%`);
    if (query.minPrice !== undefined) db = db.gte("price", query.minPrice);
    if (query.maxPrice !== undefined) db = db.lte("price", query.maxPrice);
    if (query.q) db = db.textSearch("search_vector", query.q, { type: "websearch" });
    if (query.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", query.category)
        .maybeSingle();
      if (cat) db = db.eq("category_id", cat.id);
    }

    const from = (page - 1) * PAGE_SIZE;
    const { data, count, error } = await db
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    const real = (data as DbListingRow[] | null)?.map(dbRowToCardData) ?? [];

    // If there are no real results at all (fresh project), show sample data
    // filtered the same way, so the browse page still demonstrates the UX.
    if ((count ?? 0) === 0 && page === 1) {
      const filtered = filterSampleListings(query);
      return {
        listings: filtered.map(sampleToCardData),
        total: filtered.length,
        usingSampleData: true,
      };
    }

    return { listings: real, total: count ?? real.length, usingSampleData: false };
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
 * brand/product/part match exactly (see lib/matching.ts for the rule).
 * Sample data is always included as extra (clearly badged) results so the
 * matching flow demonstrates real behavior before you have live listings.
 */
export async function getNeedMatches(query: MatchableFields): Promise<NeedMatchResult> {
  const sampleMatches = findExactMatches(query, SAMPLE_LISTINGS).map(sampleToCardData);

  if (!isSupabaseConfigured()) {
    return { matches: sampleMatches, usingSampleData: sampleMatches.length > 0 };
  }

  try {
    const supabase = await createClient();
    let db = supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .ilike("brand_name", query.brand)
      .ilike("product_name", query.product)
      .ilike("part_name", query.part);

    if (query.model) db = db.ilike("model_label", query.model);

    const { data, error } = await db.order("created_at", { ascending: false });
    if (error) throw error;

    const real = (data as DbListingRow[] | null)?.map(dbRowToCardData) ?? [];
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

/**
 * Powers /parts/[id]. Checks the real DB first, falls back to sample data by
 * id. Uses two simple queries (listing, then seller profile) rather than a
 * PostgREST embedded-relation alias - a little more explicit, and easier to
 * follow if you're new to Supabase.
 */
export async function getListingDetail(id: string): Promise<ListingDetail | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: row, error } = await supabase
        .from("listings")
        .select(
          `id, seller_id, brand_name, product_name, model_label, part_name, condition, price,
           currency, description, location, status, created_at,
           listing_images ( storage_path, sort_order )`
        )
        .eq("id", id)
        .maybeSingle();

      if (!error && row) {
        const typedRow = row as unknown as DbListingRow & {
          seller_id: string;
          currency: string;
          description: string;
          status: string;
          created_at: string;
        };

        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, location")
          .eq("id", typedRow.seller_id)
          .maybeSingle();

        const images = [...(typedRow.listing_images ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => publicImageUrl(img.storage_path))
          .filter((url): url is string => Boolean(url));

        return {
          id: typedRow.id,
          sellerId: typedRow.seller_id,
          brand: typedRow.brand_name,
          product: typedRow.product_name,
          model: typedRow.model_label,
          part: typedRow.part_name,
          condition: typedRow.condition,
          price: Number(typedRow.price),
          currency: typedRow.currency,
          description: typedRow.description,
          location: typedRow.location,
          status: typedRow.status,
          createdAt: typedRow.created_at,
          images,
          seller: profile ? { displayName: profile.display_name, location: profile.location } : null,
          isSample: false,
        };
      }
    } catch {
      // fall through to sample lookup below
    }
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
