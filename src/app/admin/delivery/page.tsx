import { getAllDeliveryPricesAdmin } from "@/lib/data-service";
import { DeliveryManagement } from "@/components/admin/DeliveryManagement";
import { requireAdminPage } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  await requireAdminPage();
  const wilayas = await getAllDeliveryPricesAdmin();

  return (
    <div className="max-w-6xl mx-auto">
      <DeliveryManagement initialWilayas={wilayas} />
    </div>
  );
}
