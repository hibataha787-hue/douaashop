import { getAllCategoriesAdmin } from "@/lib/data-service";
import { CategoryManagement } from "@/components/admin/CategoryManagement";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <CategoryManagement initialCategories={categories} />
    </div>
  );
}
