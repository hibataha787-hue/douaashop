import { DeliveryPrice } from "@/types";
import { createClient } from "@/lib/supabase/client";

export async function getWilayas(): Promise<DeliveryPrice[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("delivery_prices")
      .select("*")
      .eq("active", true)
      .order("wilaya_code", { ascending: true });

    if (error) {
      console.error("Erreur Supabase wilayas :", error);
      throw new Error(`Erreur Supabase wilayas : ${error.message}`);
    }

    return (data ?? []) as DeliveryPrice[];
  } catch (error) {
    console.error("Erreur récupération wilayas :", error);
    throw error instanceof Error
      ? error
      : new Error("Erreur inconnue lors de la récupération des wilayas.");
  }
}