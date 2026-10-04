import { Category, DeliveryPrice, Product } from "@/types";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/data/products";
import { ALGERIA_WILAYAS } from "@/data/wilayas";
import { createClient } from "./supabase/client";

// Cache mémoire local pour mode hors ligne / dev rapide
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryWilayas: DeliveryPrice[] = [...ALGERIA_WILAYAS];

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      console.warn("Supabase categories fetch fallback");
    }
  }
  return memoryCategories.filter((c) => c.active);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as Category[];
      }
    } catch {
      console.warn("Supabase admin categories fetch fallback");
    }
  }
  return memoryCategories;
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from("products").select("*, categories(name, slug)").eq("active", true);

      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }
      if (options?.search) {
        query = query.ilike("name", `%${options.search}%`);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          category_name: item.categories?.name,
        })) as Product[];
      }
    } catch {
      console.warn("Supabase products fetch fallback");
    }
  }

  let results = memoryProducts.filter((p) => p.active);

  if (options?.categoryId) {
    results = results.filter((p) => p.category_id === options.categoryId);
  }
  if (options?.categorySlug) {
    const cat = memoryCategories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      results = results.filter((p) => p.category_id === cat.id);
    }
  }
  if (options?.search) {
    const term = options.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.name_ar && p.name_ar.includes(term)) ||
        p.description.toLowerCase().includes(term)
    );
  }
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          category_name: item.categories?.name,
        })) as Product[];
      }
    } catch {
      console.warn("Supabase admin products fallback");
    }
  }
  return memoryProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return {
          ...data,
          category_name: data.categories?.name,
        } as Product;
      }
    } catch {
      console.warn("Supabase get product by slug fallback");
    }
  }
  return memoryProducts.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id)
        .single();
      if (!error && data) {
        return { ...data, category_name: data.categories?.name } as Product;
      }
    } catch {}
  }
  return memoryProducts.find((p) => p.id === id) || null;
}

export async function getDeliveryPrices(): Promise<DeliveryPrice[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("delivery_prices")
        .select("*")
        .order("wilaya_code", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as DeliveryPrice[];
      }
    } catch {
      console.warn("Supabase delivery prices fallback");
    }
  }
  return memoryWilayas;
}

export async function getDeliveryPriceByWilaya(wilayaCode: number): Promise<DeliveryPrice | null> {
  const all = await getDeliveryPrices();
  return all.find((w) => w.wilaya_code === wilayaCode) || null;
}

export async function addProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: "prod-" + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: newProduct.name,
          name_ar: newProduct.name_ar,
          slug: newProduct.slug,
          description: newProduct.description,
          price: newProduct.price,
          old_price: newProduct.old_price,
          image: newProduct.image,
          category_id: newProduct.category_id,
          badge: newProduct.badge,
          rating: newProduct.rating,
          reviews_count: newProduct.reviews_count,
          in_stock: newProduct.in_stock,
          active: newProduct.active,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {}
  }

  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }
    } catch {}
  }

  const idx = memoryProducts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...updates, updated_at: new Date().toISOString() };
    return memoryProducts[idx];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) return true;
    } catch {}
  }

  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  return true;
}

export async function updateDeliveryPrice(
  wilayaCode: number,
  homePrice: number,
  stopdeskPrice?: number
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("delivery_prices")
        .update({
          home_price: homePrice,
          stopdesk_price: stopdeskPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("wilaya_code", wilayaCode);

      if (!error) return true;
    } catch {}
  }

  const w = memoryWilayas.find((item) => item.wilaya_code === wilayaCode);
  if (w) {
    w.home_price = homePrice;
    if (stopdeskPrice !== undefined) w.stopdesk_price = stopdeskPrice;
    return true;
  }
  return false;
}
