"use server";

import { revalidatePath } from "next/cache";
import {
  updateDeliveryPrice,
  addDeliveryWilaya,
  deleteDeliveryWilaya,
} from "@/lib/data-service";
import { requireAdmin } from "@/lib/supabase/admin";
import { DeliveryPrice } from "@/types";
import { z } from "zod";

const WilayaCodeSchema = z.number().int().min(1).max(58);
const PriceSchema = z.number().finite().nonnegative().max(1000000);
const NewWilayaSchema = z.object({
  wilaya_code: WilayaCodeSchema,
  wilaya_name: z.string().trim().min(2).max(100),
  wilaya_name_ar: z.string().trim().min(2).max(100),
  home_price: PriceSchema,
  stopdesk_price: PriceSchema.nullable().optional(),
  active: z.boolean(),
});

export async function updateDeliveryPriceAction(
  wilayaCode: number,
  homePrice: number,
  stopdeskPrice?: number | null
) {
  try {
    await requireAdmin();
    const validatedCode = WilayaCodeSchema.parse(wilayaCode);
    const validatedHomePrice = PriceSchema.parse(homePrice);
    const validatedStopdeskPrice =
      stopdeskPrice === undefined
        ? undefined
        : PriceSchema.nullable().parse(stopdeskPrice);
    const success = await updateDeliveryPrice(
      validatedCode,
      validatedHomePrice,
      validatedStopdeskPrice
    );
    if (!success) {
      throw new Error("Impossible de mettre à jour le tarif.");
    }
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la mise à jour du tarif.",
    };
  }
}

export async function addDeliveryWilayaAction(data: Omit<DeliveryPrice, "id">) {
  try {
    await requireAdmin();
    const wilaya = await addDeliveryWilaya(NewWilayaSchema.parse(data));
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true, wilaya };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de l'ajout de la wilaya.",
    };
  }
}

export async function deleteDeliveryWilayaAction(wilayaCode: number) {
  try {
    await requireAdmin();
    await deleteDeliveryWilaya(WilayaCodeSchema.parse(wilayaCode));
    revalidatePath("/checkout");
    revalidatePath("/admin/delivery");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la suppression de la wilaya.",
    };
  }
}
