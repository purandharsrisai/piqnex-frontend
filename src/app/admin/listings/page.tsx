import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/States";
import { AdminListingRow } from "@/components/admin/AdminListingRow";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { getAllListingsForAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin - Listings" };

const PAGE_SIZE = 20;

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Math.max(1, Number(pageParam) || 1);

  const { rows, total } = await getAllListingsForAdmin(page);

  return (
    <div>
      <p className="mb-4 text-sm text-ink-500">{total} total listing{total === 1 ? "" : "s"}</p>
      {rows.length > 0 ? (
        <div className="flex flex-col gap-2">
          {rows.map((listing) => (
            <AdminListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState title="No listings yet" description="Listings will show up here once sellers publish them." />
      )}
      <AdminPagination basePath="/admin/listings" page={page} total={total} pageSize={PAGE_SIZE} />
    </div>
  );
}
