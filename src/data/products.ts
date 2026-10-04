import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Category, Product } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Erreur Supabase catégories :", error);
    return [];
  }

  return data as Category[];
}

export async function getProducts(): Promise<Product[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name,
        name_ar,
        slug
      )
    `)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase produits :", error);
    return [];
  }

  return data.map((product: any) => ({
    ...product,
    category_name: product.categories?.name ?? "",
  })) as Product[];
}