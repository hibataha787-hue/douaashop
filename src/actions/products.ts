"use server";

import { revalidatePath } from "next/cache";
import { addProduct, deleteProduct, updateProduct } from "@/lib/data-service";
import { requireAdmin } from "@/lib/supabase/admin";
import { Product } from "@/types";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().trim().min(2).max(255),
  name_ar: z.string().trim().max(255).optional(),
  price: z.number().finite().nonnegative(),
  old_price: z.number().finite().nonnegative().optional(),
  description: z.string().max(5000),
  description_ar: z.string().max(5000).optional(),
  image: z.string().url().max(2048),
  additional_images: z.array(z.string().url().max(2048)).max(10).optional(),
  category_id: z.string().uuid(),
  badge: z.string().trim().max(50).optional(),
  in_stock: z.boolean(),
  active: z.boolean(),
});

const ProductUpdateSchema = ProductSchema.partial().refine(
  (updates) => Object.keys(updates).length > 0,
  "Aucune modification à enregistrer."
);

export async function createProductAction(data: {
  name: string;
  name_ar?: string;
  price: number;
  old_price?: number;
  description: string;
  image: string;
  category_id: string;
  badge?: string;
  in_stock: boolean;
  active: boolean;
}) {
  try {
    await requireAdmin();
    const validated = ProductSchema.parse(data);
    const slug = validated.name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const product = await addProduct({
      ...validated,
      slug,
      rating: 5.0,
      reviews_count: 1,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la création du produit.",
    };
  }
}

export async function updateProductAction(id: string, updates: Partial<Product>) {
  try {
    await requireAdmin();
    const validatedId = z.string().uuid().parse(id);
    const validatedUpdates = ProductUpdateSchema.parse(updates);
    const product = await updateProduct(validatedId, validatedUpdates);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la modification du produit.",
    };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await requireAdmin();
    await deleteProduct(z.string().uuid().parse(id));
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la suppression du produit.",
    };
  }
}
