import { getAllCategoriesAdmin, getAllProductsAdmin } from "@/lib/data-service";
import { ProductManagement } from "@/components/admin/ProductManagement";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <ProductManagement initialProducts={products} categories={categories} />
    </div>
  );
}
