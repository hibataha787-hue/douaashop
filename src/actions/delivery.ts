"use server";

import { revalidatePath } from "next/cache";
import { updateDeliveryPrice } from "@/lib/data-service";

export async function updateDeliveryPriceAction(
  wilayaCode: number,
  homePrice: number,
  stopdeskPrice?: number
) {
  try {
    const success = await updateDeliveryPrice(wilayaCode, homePrice, stopdeskPrice);
    if (!success) {
      throw new Error("Impossible de mettre à jour le tarif.");
    }
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
