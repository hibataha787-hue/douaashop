import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { DeliveryPrice } from "@/types";

export async function getWilayas(): Promise<DeliveryPrice[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("delivery_prices")
    .select("*")
    .eq("active", true)
    .order("wilaya_code", { ascending: true });

  if (error) {
    console.error("Erreur Supabase wilayas :", error);
    return [];
  }

  return data as DeliveryPrice[];
}