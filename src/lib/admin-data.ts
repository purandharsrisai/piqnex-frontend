import { createAdminClient } from "@/lib/supabase/admin";
import { publicImageUrl } from "@/lib/listings";
import type { ConditionOption, ListingStatus, NeedRequestStatus } from "@/lib/types";

/**
 * Data-access layer for the /admin area. Every function here uses the
 * service-role client (bypasses RLS) so admins can see/manage every user's
 * data, not just their own - see lib/supabase/admin.ts and
 * lib/actions/admin.ts (requireAdmin) for the authorization boundary that
 * must be checked BEFORE any of these are called.
 */

const PAGE_SIZE = 20;

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

/** All listings, any seller, any status - powers /admin/listings. */
export async function getAllListingsForAdmin(page = 1): Promise<AdminListResult<AdminListingRow>> {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data, count, error } = await supabase
    .from("listings")
    .select(
      `id, seller_id, brand_name, product_name, model_label, part_name, condition, price, status, created_at,
       listing_images ( storage_path, sort_order ),
       profiles ( display_name )`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error || !data) return { rows: [], total: 0 };

  const rows = data.map((row: any): AdminListingRow => {
    const images = [...(row.listing_images ?? [])].sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    );
    return {
      id: row.id,
      sellerId: row.seller_id,
      sellerName: row.profiles?.display_name ?? "Unknown",
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

  return { rows, total: count ?? rows.length };
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

/** All need requests, any requester, any status - powers /admin/need-requests. */
export async function getAllNeedRequestsForAdmin(
  page = 1
): Promise<AdminListResult<AdminNeedRequestRow>> {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data, count, error } = await supabase
    .from("need_requests")
    .select(
      `id, requester_id, brand_name, product_name, model_label, part_name, status, created_at,
       profiles ( display_name )`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error || !data) return { rows: [], total: 0 };

  const rows = data.map((row: any): AdminNeedRequestRow => ({
    id: row.id,
    requesterId: row.requester_id,
    requesterName: row.profiles?.display_name ?? "Unknown",
    brand: row.brand_name,
    product: row.product_name,
    model: row.model_label,
    part: row.part_name,
    status: row.status,
    createdAt: row.created_at,
  }));

  return { rows, total: count ?? rows.length };
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
 * All users - powers /admin/users. Emails live in auth.users, not
 * `profiles`, so they can only be read via the admin API (service role).
 */
export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  const supabase = createAdminClient();

  const [{ data: profiles, error: profilesError }, authUsers] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, location, is_admin, created_at")
      .order("created_at", { ascending: false }),
    listAllAuthUsers(supabase),
  ]);

  if (profilesError || !profiles) return [];

  const emailById = new Map(authUsers.map((u) => [u.id, u.email ?? null]));

  return profiles.map((p) => ({
    id: p.id,
    displayName: p.display_name,
    email: emailById.get(p.id) ?? null,
    location: p.location,
    isAdmin: p.is_admin,
    createdAt: p.created_at,
  }));
}

/** Pages through supabase.auth.admin.listUsers() - it caps at 1000/page. */
async function listAllAuthUsers(supabase: ReturnType<typeof createAdminClient>) {
  const perPage = 1000;
  let page = 1;
  const all: { id: string; email?: string | null }[] = [];

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data) break;
    all.push(...data.users.map((u) => ({ id: u.id, email: u.email })));
    if (data.users.length < perPage) break;
    page += 1;
  }

  return all;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

/** Categories are already publicly readable, so no service role needed here. */
export async function getCategoriesForAdmin(): Promise<AdminCategory[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, icon, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    sortOrder: c.sort_order,
  }));
}

export interface AdminBrand {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
}

export async function getBrandsForAdmin(): Promise<AdminBrand[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id, slug, name, category_id, categories ( name )")
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data.map((b: any) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    categoryId: b.category_id,
    categoryName: b.categories?.name ?? null,
  }));
}

/** Cheap counts for the /admin overview page. */
export async function getAdminOverviewCounts() {
  const supabase = createAdminClient();

  const [listingsTotal, listingsActive, needRequestsOpen, users] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("need_requests").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalListings: listingsTotal.count ?? 0,
    activeListings: listingsActive.count ?? 0,
    openNeedRequests: needRequestsOpen.count ?? 0,
    totalUsers: users.count ?? 0,
  };
}
