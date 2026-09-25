import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Simple prev/next pager, styled to match the one on /browse. */
export function AdminPagination({
  basePath,
  page,
  total,
  pageSize,
}: {
  basePath: string;
  page: number;
  total: number;
  pageSize: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
      <Link
        href={`${basePath}?page=${Math.max(1, page - 1)}`}
        aria-disabled={page === 1}
        className={`flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-2 text-sm ${
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-ink-50"
        }`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </Link>
      <span className="text-sm text-ink-500">
        Page {page} of {totalPages}
      </span>
      <Link
        href={`${basePath}?page=${Math.min(totalPages, page + 1)}`}
        aria-disabled={page === totalPages}
        className={`flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-2 text-sm ${
          page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-ink-50"
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
