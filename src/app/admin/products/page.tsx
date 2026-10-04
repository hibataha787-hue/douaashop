import { getAllCategoriesAdmin, getAllProductsAdmin } from "@/lib/data-service";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { requireAdminPage } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdminPage();
  const products = await getAllProductsAdmin();
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <ProductManagement initialProducts={products} categories={categories} />
    </div>
  );
}
