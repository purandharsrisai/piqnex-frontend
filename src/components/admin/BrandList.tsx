"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { adminDeleteBrandAction } from "@/lib/actions/admin";
import type { AdminBrand } from "@/lib/admin-data";

export function BrandList({ brands }: { brands: AdminBrand[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete the "${name}" brand?`)) return;
    setError(null);
    startTransition(() => {
      adminDeleteBrandAction(id).then((result) => {
        if (result.status === "error") setError(result.message ?? "Couldn't delete that brand.");
      });
    });
  }

  if (brands.length === 0) {
    return <p className="text-sm text-ink-500">No brands yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {brands.map((brand) => (
        <Card key={brand.id} className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{brand.name}</p>
            <p className="text-xs text-ink-500">
              /{brand.slug} &middot; {brand.categoryName ?? "No category"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleDelete(brand.id, brand.name)}
            title="Delete brand"
          >
            <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
