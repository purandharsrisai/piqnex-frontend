import { apiFetch } from "@/lib/api-client";
import { publicImageUrl } from "@/lib/listings";
import type { ListingCardData } from "@/components/listings/ListingCard";
import type { ConditionOption } from "@/lib/types";

export interface SellerProfileData {
  seller: { id: string; displayName: string; location: string | null; createdAt: string };
  rating: { average: number | null; count: number };
  soldCount: number;
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: { id: string; displayName: string };
    listing: { id: string; partName: string };
  }[];
  listings: ListingCardData[];
}

interface RawListing {
  id: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  condition: ConditionOption;
  price: number | string;
  location: string | null;
  images: { storagePath: string; sortOrder: number }[];
}

export async function getSellerProfile(id: string): Promise<SellerProfileData | null> {
  try {
    const raw = await apiFetch<Omit<SellerProfileData, "listings"> & { listings: RawListing[] }>(`/sellers/${id}`, {
      authenticated: false,
    });
    return {
      ...raw,
      listings: raw.listings.map((l) => ({
        id: l.id,
        imageUrl: l.images[0] ? publicImageUrl(l.images[0].storagePath) : null,
        brand: l.brandName,
        product: l.productName,
        model: l.modelLabel,
        part: l.partName,
        condition: l.condition,
        price: Number(l.price),
        location: l.location,
        isSample: false,
      })),
    };
  } catch {
    return null;
  }
}

export async function getSellerRating(id: string): Promise<{ average: number | null; count: number }> {
  try {
    return await apiFetch(`/sellers/${id}/rating`, { authenticated: false });
  } catch {
    return { average: null, count: 0 };
  }
}

export async function getReviewEligibility(listingId: string): Promise<{ canReview: boolean; hasReviewed: boolean }> {
  try {
    return await apiFetch(`/listings/${listingId}/review-eligibility`);
  } catch {
    return { canReview: false, hasReviewed: false };
  }
}
