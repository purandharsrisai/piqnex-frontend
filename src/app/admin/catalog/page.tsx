import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { BrandForm } from "@/components/admin/BrandForm";
import { CategoryList } from "@/components/admin/CategoryList";
import { BrandList } from "@/components/admin/BrandList";
import { getCategoriesForAdmin, getBrandsForAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Admin - Categories & Brands" };

export default async function AdminCatalogPage() {
  const [categories, brands] = await Promise.all([getCategoriesForAdmin(), getBrandsForAdmin()]);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-lg font-bold text-ink-900">Categories</h2>
        <Card className="mt-3 p-5">
          <CategoryForm />
        </Card>
        <div className="mt-4">
          <CategoryList categories={categories} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink-900">Brands</h2>
        <Card className="mt-3 p-5">
          <BrandForm categories={categories} />
        </Card>
        <div className="mt-4">
          <BrandList brands={brands} />
        </div>
      </section>
    </div>
  );
}
