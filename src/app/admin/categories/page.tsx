import { getAllCategoriesAdmin } from "@/lib/data-service";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { requireAdminPage } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdminPage();
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <CategoryManagement initialCategories={categories} />
    </div>
  );
}
