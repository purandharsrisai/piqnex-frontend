import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/States";
import { AdminNeedRequestRow } from "@/components/admin/AdminNeedRequestRow";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { getAllNeedRequestsForAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin - Need Requests" };

const PAGE_SIZE = 20;

export default async function AdminNeedRequestsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Math.max(1, Number(pageParam) || 1);

  const { rows, total } = await getAllNeedRequestsForAdmin(page);

  return (
    <div>
      <p className="mb-4 text-sm text-ink-500">
        {total} total need request{total === 1 ? "" : "s"}
      </p>
      {rows.length > 0 ? (
        <div className="flex flex-col gap-2">
          {rows.map((request) => (
            <AdminNeedRequestRow key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <EmptyState title="No need requests yet" description="Requests will show up here once buyers save one." />
      )}
      <AdminPagination basePath="/admin/need-requests" page={page} total={total} pageSize={PAGE_SIZE} />
    </div>
  );
}
