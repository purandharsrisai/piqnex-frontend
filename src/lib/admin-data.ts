import { apiFetch } from "@/lib/api-client";
import { publicImageUrl } from "@/lib/listings";
import type { ConditionOption, ListingStatus, NeedRequestStatus } from "@/lib/types";

/**
 * Data-access layer for the /admin area - now calling piqnex-backend's
 * AdminController (every route there requires JwtAuthGuard + AdminGuard,
 * see src/app/admin/layout.tsx for the frontend-side gate). This replaces
 * the old service-role Supabase client that bypassed RLS directly.
 */

export interface AdminListingRow {
  id: string;
  sellerId: string;
  sellerName: string;
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

export interface AdminListResult<T> {
  rows: T[];
  total: number;
}

interface BackendAdminListing {
  id: string;
  sellerId: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  condition: ConditionOption;
  price: number | string;
  status: ListingStatus;
  createdAt: string;
  images: { storagePath: string; sortOrder: number }[];
  seller: { id: string; displayName: string } | null;
}

/** All listings, any seller, any status - powers /admin/listings. */
export async function getAllListingsForAdmin(page = 1): Promise<AdminListResult<AdminListingRow>> {
  try {
    const { items, total } = await apiFetch<{ items: BackendAdminListing[]; total: number }>(
      "/admin/listings",
      { query: { page } },
    );

    const rows = items.map((row): AdminListingRow => {
      const images = [...(row.images ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
      return {
        id: row.id,
        sellerId: row.sellerId,
        sellerName: row.seller?.displayName ?? "Unknown",
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

    return { rows, total };
  } catch {
    return { rows: [], total: 0 };
  }
}

export interface AdminNeedRequestRow {
  id: string;
  requesterId: string;
  requesterName: string;
  brand: string;
  product: string;
  model: string | null;
  part: string;
  status: NeedRequestStatus;
  createdAt: string;
}

interface BackendAdminNeedRequest {
  id: string;
  requesterId: string;
  brandName: string;
  productName: string;
  modelLabel: string | null;
  partName: string;
  status: NeedRequestStatus;
  createdAt: string;
  requester: { id: string; displayName: string } | null;
}

/** All need requests, any requester, any status - powers /admin/need-requests. */
export async function getAllNeedRequestsForAdmin(
  page = 1
): Promise<AdminListResult<AdminNeedRequestRow>> {
  try {
    const { items, total } = await apiFetch<{ items: BackendAdminNeedRequest[]; total: number }>(
      "/admin/need-requests",
      { query: { page } },
    );

    const rows = items.map((row): AdminNeedRequestRow => ({
      id: row.id,
      requesterId: row.requesterId,
      requesterName: row.requester?.displayName ?? "Unknown",
      brand: row.brandName,
      product: row.productName,
      model: row.modelLabel,
      part: row.partName,
      status: row.status,
      createdAt: row.createdAt,
    }));

    return { rows, total };
  } catch {
    return { rows: [], total: 0 };
  }
}

export interface AdminUserRow {
  id: string;
  displayName: string;
  email: string | null;
  location: string | null;
  isAdmin: boolean;
  createdAt: string;
}

/**
 * All users - powers /admin/users. piqnex-backend's User model already
 * merges what used to be split across Supabase's auth.users + profiles, so
 * this is a single call instead of the old profiles + auth.admin.listUsers()
 * pagination dance.
 */
export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  try {
    return await apiFetch<AdminUserRow[]>("/admin/users");
  } catch {
    return [];
  }
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export async function getCategoriesForAdmin(): Promise<AdminCategory[]> {
  try {
    return await apiFetch<AdminCategory[]>("/admin/categories");
  } catch {
    return [];
  }
}

export interface AdminBrand {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
}

interface BackendAdminBrand {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
}

/**
 * piqnex-backend's GET /admin/brands doesn't join the category name (see
 * AdminService.getBrands) - fetch categories alongside and join client-side
 * to keep this function's return shape the same as the old Supabase version.
 */
export async function getBrandsForAdmin(): Promise<AdminBrand[]> {
  try {
    const [brands, categories] = await Promise.all([
      apiFetch<BackendAdminBrand[]>("/admin/brands"),
      getCategoriesForAdmin(),
    ]);
    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

    return brands.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      categoryId: b.categoryId,
      categoryName: b.categoryId ? categoryNameById.get(b.categoryId) ?? null : null,
    }));
  } catch {
    return [];
  }
}

/** Cheap counts for the /admin overview page. */
export async function getAdminOverviewCounts() {
  try {
    const overview = await apiFetch<{
      totalListings: number;
      activeListings: number;
      openNeedRequests: number;
      users: number;
    }>("/admin/overview");

    return {
      totalListings: overview.totalListings,
      activeListings: overview.activeListings,
      openNeedRequests: overview.openNeedRequests,
      totalUsers: overview.users,
    };
  } catch {
    return { totalListings: 0, activeListings: 0, openNeedRequests: 0, totalUsers: 0 };
  }
}
