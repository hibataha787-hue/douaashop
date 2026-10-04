import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Category, Product } from "@/types";

type ProductCategoryRow = Product & {
  categories: {
    name: string | null;
    name_ar: string | null;
    slug: string;
  } | null;
};

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
    throw new Error(`Erreur Supabase catégories : ${error.message}`);
  }

  return (data ?? []) as Category[];
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
    throw new Error(`Erreur Supabase produits : ${error.message}`);
  }

  return ((data ?? []) as unknown as ProductCategoryRow[]).map((product) => ({
    ...product,
    category_name: product.categories?.name ?? "",
    category_name_ar: product.categories?.name_ar ?? "",
  })) as Product[];
}