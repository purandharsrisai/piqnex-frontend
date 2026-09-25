"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { adminDeleteCategoryAction } from "@/lib/actions/admin";
import type { AdminCategory } from "@/lib/admin-data";

export function CategoryList({ categories }: { categories: AdminCategory[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete the "${name}" category?`)) return;
    setError(null);
    startTransition(() => {
      adminDeleteCategoryAction(id).then((result) => {
        if (result.status === "error") setError(result.message ?? "Couldn't delete that category.");
      });
    });
  }

  if (categories.length === 0) {
    return <p className="text-sm text-ink-500">No categories yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {categories.map((category) => (
        <Card key={category.id} className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{category.name}</p>
            <p className="text-xs text-ink-500">/{category.slug}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleDelete(category.id, category.name)}
            title="Delete category"
          >
            <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
