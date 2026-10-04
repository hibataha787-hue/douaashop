import { getDeliveryPrices } from "@/lib/data-service";
import { DeliveryManagement } from "@/components/admin/DeliveryManagement";

export default async function AdminDeliveryPage() {
  const wilayas = await getDeliveryPrices();

  return (
    <div className="max-w-6xl mx-auto">
      <DeliveryManagement initialWilayas={wilayas} />
    </div>
  );
}
