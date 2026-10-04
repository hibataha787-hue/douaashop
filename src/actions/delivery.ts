"use server";

import { revalidatePath } from "next/cache";
import {
  updateDeliveryPrice,
  addDeliveryWilaya,
  deleteDeliveryWilaya,
} from "@/lib/data-service";
import { DeliveryPrice } from "@/types";

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

export async function addDeliveryWilayaAction(data: Omit<DeliveryPrice, "id">) {
  try {
    const wilaya = await addDeliveryWilaya(data);
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true, wilaya };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteDeliveryWilayaAction(wilayaCode: number) {
  try {
    await deleteDeliveryWilaya(wilayaCode);
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

