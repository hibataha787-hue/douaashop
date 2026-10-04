import { Category, DeliveryPrice, Product } from "@/types";
import { createClient as createBrowserClient } from "./supabase/client";
import { createClient as createServerClient } from "./supabase/server";
import { cookies } from "next/headers";

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
// CLIENT BROWSER
// ============================================================

function getBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré.");
  }

  return createBrowserClient();
}

// ============================================================
// CLIENT SERVER
// Utilisé par les Server Actions admin
// ============================================================

async function getServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase n'est pas configuré.");
  }

  const cookieStore = await cookies();

  return createServerClient(cookieStore);
}

// ============================================================
// CATEGORIES - PUBLIC
// ============================================================

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getBrowserClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Erreur Supabase catégories :", error);
      return [];
    }

    return (data ?? []) as Category[];
  } catch (error) {
    console.error("Erreur récupération catégories :", error);
    return [];
  }
}

// ============================================================
// ADMIN - TOUTES LES CATEGORIES
// ============================================================

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await getServerClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Erreur Supabase catégories admin :",
        error
      );
      return [];
    }

    return (data ?? []) as Category[];
  } catch (error) {
    console.error(
      "Erreur récupération catégories admin :",
      error
    );
    return [];
  }
}

// ============================================================
// PRODUCTS - PUBLIC
// ============================================================

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getBrowserClient();

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
      .eq("active", true)
      .order("created_at", { ascending: false });

    // --------------------------------------------------------
    // FILTRE PAR SLUG
    // --------------------------------------------------------

    if (options?.categorySlug) {
      const { data: category, error: categoryError } =
        await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.categorySlug)
          .eq("active", true)
          .maybeSingle();

      if (categoryError) {
        console.error(
          "Erreur recherche catégorie :",
          categoryError
        );
        return [];
      }

      if (!category) {
        return [];
      }

      query = query.eq("category_id", category.id);
    }

    // --------------------------------------------------------
    // FILTRE PAR UUID
    // --------------------------------------------------------

    else if (
      options?.categoryId &&
      !options.categoryId.startsWith("cat-")
    ) {
      query = query.eq(
        "category_id",
        options.categoryId
      );
    }

    // --------------------------------------------------------
    // RECHERCHE
    // --------------------------------------------------------

    if (options?.search?.trim()) {
      const search = options.search.trim();

      query = query.or(
        `name.ilike.%${search}%,name_ar.ilike.%${search}%`
      );
    }

    // --------------------------------------------------------
    // LIMIT
    // --------------------------------------------------------

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        "Erreur Supabase produits :",
        error
      );
      return [];
    }

    return (data ?? []).map((product: any) => ({
      ...product,
      category_name:
        product.categories?.name ?? "",
      category_name_ar:
        product.categories?.name_ar ?? "",
    })) as Product[];
  } catch (error) {
    console.error(
      "Erreur récupération produits :",
      error
    );
    return [];
  }
}

// ============================================================
// ADMIN - TOUS LES PRODUITS
// ============================================================

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await getServerClient();

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

    if (error) {
      console.error(
        "Erreur Supabase produits admin :",
        error
      );
      return [];
    }

    return (data ?? []).map((product: any) => ({
      ...product,
      category_name:
        product.categories?.name ?? "",
      category_name_ar:
        product.categories?.name_ar ?? "",
    })) as Product[];
  } catch (error) {
    console.error(
      "Erreur récupération produits admin :",
      error
    );
    return [];
  }
}

// ============================================================
// PRODUCT PAR SLUG
// ============================================================

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = getBrowserClient();

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

    if (error) {
      console.error(
        "Erreur product by slug :",
        error
      );
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      category_name:
        data.categories?.name ?? "",
      category_name_ar:
        data.categories?.name_ar ?? "",
    } as Product;
  } catch (error) {
    console.error(
      "Erreur récupération produit par slug :",
      error
    );
    return null;
  }
}

// ============================================================
// PRODUCT PAR ID
// ============================================================

export async function getProductById(
  id: string
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = getBrowserClient();

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

    if (error) {
      console.error(
        "Erreur product by ID :",
        error
      );
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      category_name:
        data.categories?.name ?? "",
      category_name_ar:
        data.categories?.name_ar ?? "",
    } as Product;
  } catch (error) {
    console.error(
      "Erreur récupération produit par ID :",
      error
    );
    return null;
  }
}

// ============================================================
// DELIVERY - PUBLIC
// ============================================================

export async function getDeliveryPrices(): Promise<
  DeliveryPrice[]
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getBrowserClient();

    const { data, error } = await supabase
      .from("delivery_prices")
      .select("*")
      .eq("active", true)
      .order("wilaya_code", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur Supabase wilayas :",
        error
      );
      return [];
    }

    return (data ?? []) as DeliveryPrice[];
  } catch (error) {
    console.error(
      "Erreur récupération wilayas :",
      error
    );
    return [];
  }
}

// ============================================================
// DELIVERY PAR WILAYA
// ============================================================

export async function getDeliveryPriceByWilaya(
  wilayaCode: number
): Promise<DeliveryPrice | null> {
  const wilayas = await getDeliveryPrices();

  return (
    wilayas.find(
      (wilaya) =>
        wilaya.wilaya_code === wilayaCode
    ) ?? null
  );
}

// ============================================================
// ADMIN - ADD PRODUCT
// ============================================================

export async function addProduct(
  product: Omit<
    Product,
    "id" | "created_at" | "updated_at"
  >
): Promise<Product> {
  const supabase = await getServerClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      name_ar: product.name_ar ?? null,
      slug: product.slug,
      description: product.description ?? null,
      description_ar: product.description_ar ?? null,
      price: product.price,
      old_price: product.old_price ?? null,
      image: product.image,
      additional_images:
        product.additional_images ?? [],
      category_id: product.category_id,
      badge: product.badge ?? null,
      rating: product.rating ?? 5,
      reviews_count:
        product.reviews_count ?? 1,
      in_stock:
        product.in_stock ?? true,
      active:
        product.active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Erreur ajout produit :",
      error
    );

    throw new Error(
      `Impossible d'ajouter le produit : ${error.message}`
    );
  }

  return data as Product;
}

// ============================================================
// ADMIN - UPDATE PRODUCT
// ============================================================

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const supabase = await getServerClient();

  const allowedUpdates = {
    name: updates.name,
    name_ar: updates.name_ar,
    slug: updates.slug,
    description: updates.description,
    description_ar: updates.description_ar,
    price: updates.price,
    old_price: updates.old_price,
    image: updates.image,
    additional_images:
      updates.additional_images,
    category_id: updates.category_id,
    badge: updates.badge,
    rating: updates.rating,
    reviews_count:
      updates.reviews_count,
    in_stock: updates.in_stock,
    active: updates.active,
  };

  const cleanUpdates = Object.fromEntries(
    Object.entries(allowedUpdates).filter(
      ([, value]) => value !== undefined
    )
  );

  const { data, error } = await supabase
    .from("products")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Erreur modification produit :",
      error
    );

    throw new Error(
      `Impossible de modifier le produit : ${error.message}`
    );
  }

  return data as Product;
}

// ============================================================
// ADMIN - DELETE PRODUCT
// ============================================================

export async function deleteProduct(
  id: string
): Promise<boolean> {
  const supabase = await getServerClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erreur suppression produit :",
      error
    );

    throw new Error(
      `Impossible de supprimer le produit : ${error.message}`
    );
  }

  return true;
}

// ============================================================
// ADMIN - UPDATE DELIVERY PRICE
// ============================================================

export async function updateDeliveryPrice(
  wilayaCode: number,
  homePrice: number,
  stopdeskPrice?: number
): Promise<boolean> {
  const supabase = await getServerClient();

  const updateData: {
    home_price: number;
    stopdesk_price?: number;
  } = {
    home_price: homePrice,
  };

  if (stopdeskPrice !== undefined) {
    updateData.stopdesk_price =
      stopdeskPrice;
  }

  const { error } = await supabase
    .from("delivery_prices")
    .update(updateData)
    .eq("wilaya_code", wilayaCode);

  if (error) {
    console.error(
      "Erreur modification livraison :",
      error
    );

    throw new Error(
      `Impossible de modifier le prix de livraison : ${error.message}`
    );
  }

  return true;
}

// ============================================================
// ADMIN - ADD DELIVERY WILAYA
// ============================================================

export async function addDeliveryWilaya(
  wilaya: Omit<DeliveryPrice, "id">
): Promise<DeliveryPrice> {
  const supabase = await getServerClient();

  const { data, error } = await supabase
    .from("delivery_prices")
    .insert({
      wilaya_code: wilaya.wilaya_code,
      wilaya_name: wilaya.wilaya_name,
      wilaya_name_ar: wilaya.wilaya_name_ar,
      home_price: wilaya.home_price,
      stopdesk_price: wilaya.stopdesk_price ?? null,
      active: wilaya.active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur ajout wilaya :", error);
    throw new Error(`Impossible d'ajouter la wilaya : ${error.message}`);
  }

  return data as DeliveryPrice;
}

// ============================================================
// ADMIN - DELETE DELIVERY WILAYA
// ============================================================

export async function deleteDeliveryWilaya(
  wilayaCode: number
): Promise<boolean> {
  const supabase = await getServerClient();

  const { error } = await supabase
    .from("delivery_prices")
    .delete()
    .eq("wilaya_code", wilayaCode);

  if (error) {
    console.error("Erreur suppression wilaya :", error);
    throw new Error(`Impossible de supprimer la wilaya : ${error.message}`);
  }

  return true;
}

// ============================================================
// ADMIN - ADD CATEGORY
// ============================================================

export async function addCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  const supabase = await getServerClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: category.name,
      name_ar: category.name_ar ?? null,
      slug: category.slug,
      image: category.image,
      subtitle: category.subtitle ?? null,
      subtitle_ar: category.subtitle_ar ?? null,
      active: category.active ?? true,
      display_order: category.display_order ?? 99,
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur ajout catégorie :", error);
    throw new Error(`Impossible d'ajouter la catégorie : ${error.message}`);
  }

  return data as Category;
}

// ============================================================
// ADMIN - UPDATE CATEGORY
// ============================================================

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category> {
  const supabase = await getServerClient();

  const allowed = {
    name: updates.name,
    name_ar: updates.name_ar,
    slug: updates.slug,
    image: updates.image,
    subtitle: updates.subtitle,
    subtitle_ar: updates.subtitle_ar,
    active: updates.active,
    display_order: updates.display_order,
  };

  const cleanUpdates = Object.fromEntries(
    Object.entries(allowed).filter(([, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from("categories")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur modification catégorie :", error);
    throw new Error(`Impossible de modifier la catégorie : ${error.message}`);
  }

  return data as Category;
}

// ============================================================
// ADMIN - DELETE CATEGORY
// ============================================================

export async function deleteCategory(
  id: string
): Promise<boolean> {
  const supabase = await getServerClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur suppression catégorie :", error);
    throw new Error(`Impossible de supprimer la catégorie : ${error.message}`);
  }

  return true;
}
