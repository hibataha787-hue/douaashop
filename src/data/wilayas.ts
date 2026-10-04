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
      return [];
    }

    return (data ?? []) as DeliveryPrice[];
  } catch (error) {
    console.error("Erreur récupération wilayas :", error);
    return [];
  }
}