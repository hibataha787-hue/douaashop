import { Category, DeliveryPrice, Product } from "@/types";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from "@/data/products";
import { ALGERIA_WILAYAS } from "@/data/wilayas";
import { createClient } from "./supabase/client";

// ============================================================
// CACHE LOCAL / FALLBACK
// ============================================================

let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryWilayas: DeliveryPrice[] = [...ALGERIA_WILAYAS];

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        return data as Category[];
      }

      console.warn("Erreur catégories Supabase :", error);
    } catch (error) {
      console.warn("Supabase categories fetch fallback :", error);
    }
  }

  return memoryCategories.filter((category) => category.active);
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

      console.warn("Erreur catégories admin :", error);
    } catch (error) {
      console.warn("Supabase admin categories fallback :", error);
    }
  }

  return memoryCategories;
}

// ============================================================
// PRODUCTS
// ============================================================

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      let query = supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            name_ar,
            slug
          )
        `)
        .eq("active", true);

      // Filtre catégorie par UUID Supabase
      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }

      // Recherche
      if (options?.search) {
        const search = options.search.trim();

        query = query.or(
          `name.ilike.%${search}%,name_ar.ilike.%${search}%`
        );
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          category_name: item.categories?.name ?? "",
          category_name_ar: item.categories?.name_ar ?? "",
        })) as Product[];
      }

      console.warn("Erreur produits Supabase :", error);
    } catch (error) {
      console.warn("Supabase products fetch fallback :", error);
    }
  }

  // ==========================================================
  // FALLBACK LOCAL
  // ==========================================================

  let results = memoryProducts.filter((product) => product.active);

  if (options?.categoryId) {
    results = results.filter(
      (product) => product.category_id === options.categoryId
    );
  }

  if (options?.categorySlug) {
    const category = memoryCategories.find(
      (category) => category.slug === options.categorySlug
    );

    if (category) {
      results = results.filter(
        (product) => product.category_id === category.id
      );
    }
  }

  if (options?.search) {
    const term = options.search.toLowerCase().trim();

    results = results.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        Boolean(product.name_ar?.includes(term)) ||
        Boolean(product.description?.toLowerCase().includes(term))
    );
  }

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

// ============================================================
// ADMIN PRODUCTS
// ============================================================

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            name_ar,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          category_name: item.categories?.name ?? "",
          category_name_ar: item.categories?.name_ar ?? "",
        })) as Product[];
      }

      console.warn("Erreur produits admin :", error);
    } catch (error) {
      console.warn("Supabase admin products fallback :", error);
    }
  }

  return memoryProducts;
}

// ============================================================
// PRODUCT PAR SLUG
// ============================================================

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            name_ar,
            slug
          )
        `)
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          category_name: data.categories?.name ?? "",
          category_name_ar: data.categories?.name_ar ?? "",
        } as Product;
      }

      if (error) {
        console.warn("Erreur product by slug :", error);
      }
    } catch (error) {
      console.warn("Supabase get product by slug fallback :", error);
    }
  }

  return (
    memoryProducts.find(
      (product) =>
        product.slug === slug ||
        product.id === slug
    ) || null
  );
}

// ============================================================
// PRODUCT PAR ID
// ============================================================

export async function getProductById(
  id: string
): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            name_ar,
            slug
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          category_name: data.categories?.name ?? "",
          category_name_ar: data.categories?.name_ar ?? "",
        } as Product;
      }

      if (error) {
        console.warn("Erreur product by ID :", error);
      }
    } catch (error) {
      console.warn("Supabase get product by id fallback :", error);
    }
  }

  return (
    memoryProducts.find(
      (product) => product.id === id
    ) || null
  );
}

// ============================================================
// DELIVERY
// ============================================================

export async function getDeliveryPrices(): Promise<
  DeliveryPrice[]
> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("delivery_prices")
        .select("*")
        .eq("active", true)
        .order("wilaya_code", { ascending: true });

      if (!error && data) {
        return data as DeliveryPrice[];
      }

      console.warn("Erreur delivery Supabase :", error);
    } catch (error) {
      console.warn(
        "Supabase delivery prices fallback :",
        error
      );
    }
  }

  return memoryWilayas.filter((wilaya) => wilaya.active);
}

// ============================================================
// DELIVERY PAR WILAYA
// ============================================================

export async function getDeliveryPriceByWilaya(
  wilayaCode: number
): Promise<DeliveryPrice | null> {
  const all = await getDeliveryPrices();

  return (
    all.find(
      (wilaya) => wilaya.wilaya_code === wilayaCode
    ) || null
  );
}

// ============================================================
// ADD PRODUCT
// ============================================================

export async function addProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          name_ar: product.name_ar,
          slug: product.slug,
          description: product.description,
          description_ar: product.description_ar,
          price: product.price,
          old_price: product.old_price,
          image: product.image,
          additional_images: product.additional_images ?? [],
          category_id: product.category_id,
          badge: product.badge,
          rating: product.rating ?? 5,
          reviews_count: product.reviews_count ?? 1,
          in_stock: product.in_stock ?? true,
          active: product.active ?? true,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Product;
      }

      console.warn("Erreur ajout produit :", error);
    } catch (error) {
      console.warn("Supabase add product fallback :", error);
    }
  }

  const newProduct: Product = {
    ...product,
    id: "prod-" + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryProducts.unshift(newProduct);

  return newProduct;
}

// ============================================================
// UPDATE PRODUCT
// ============================================================

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
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

      console.warn("Erreur update produit :", error);
    } catch (error) {
      console.warn("Supabase update product fallback :", error);
    }
  }

  const index = memoryProducts.findIndex(
    (product) => product.id === id
  );

  if (index !== -1) {
    memoryProducts[index] = {
      ...memoryProducts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return memoryProducts[index];
  }

  return null;
}

// ============================================================
// DELETE PRODUCT
// ============================================================

export async function deleteProduct(
  id: string
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (!error) {
        return true;
      }

      console.warn("Erreur suppression produit :", error);
    } catch (error) {
      console.warn("Supabase delete product fallback :", error);
    }
  }

  const before = memoryProducts.length;

  memoryProducts = memoryProducts.filter(
    (product) => product.id !== id
  );

  return memoryProducts.length < before;
}

// ============================================================
// UPDATE DELIVERY PRICE
// ============================================================

export async function updateDeliveryPrice(
  wilayaCode: number,
  homePrice: number,
  stopdeskPrice?: number
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();

      const updateData: {
        home_price: number;
        stopdesk_price?: number;
      } = {
        home_price: homePrice,
      };

      if (stopdeskPrice !== undefined) {
        updateData.stopdesk_price = stopdeskPrice;
      }

      const { error } = await supabase
        .from("delivery_prices")
        .update(updateData)
        .eq("wilaya_code", wilayaCode);

      if (!error) {
        return true;
      }

      console.warn("Erreur update livraison :", error);
    } catch (error) {
      console.warn(
        "Supabase update delivery fallback :",
        error
      );
    }
  }

  const wilaya = memoryWilayas.find(
    (item) => item.wilaya_code === wilayaCode
  );

  if (wilaya) {
    wilaya.home_price = homePrice;

    if (stopdeskPrice !== undefined) {
      wilaya.stopdesk_price = stopdeskPrice;
    }

    return true;
  }

  return false;
}