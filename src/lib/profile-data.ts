import { apiFetch } from "@/lib/api-client";
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

interface BackendMyListing {
  id: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  condition: ConditionOption;
  price: number | string;
  status: ListingStatus;
  createdAt: string;
  images: { storagePath: string; sortOrder: number }[];
}

interface BackendMyNeedRequest {
  id: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  status: NeedRequestStatus;
  createdAt: string;
}

/** All of the current (authenticated) user's listings, any status - used on /profile. */
export async function getMyListings(): Promise<MyListing[]> {
  try {
    const data = await apiFetch<BackendMyListing[]>("/profile/me/listings");
    return data.map((row) => {
      const images = [...(row.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
      return {
        id: row.id,
        brand: row.brandName,
        product: row.productName,
        model: row.modelLabel,
        part: row.partName,
        condition: row.condition,
        price: Number(row.price),
        status: row.status,
        imageUrl: images[0] ? publicImageUrl(images[0].storagePath) : null,
        createdAt: row.createdAt,
      };
    });
  } catch {
    return [];
  }
}

export async function getMyNeedRequests(): Promise<MyNeedRequest[]> {
  try {
    const data = await apiFetch<BackendMyNeedRequest[]>("/profile/me/need-requests");
    return data.map((row) => ({
      id: row.id,
      brand: row.brandName,
      product: row.productName,
      model: row.modelLabel,
      part: row.partName,
      status: row.status,
      createdAt: row.createdAt,
    }));
  } catch {
    return [];
  }
}
