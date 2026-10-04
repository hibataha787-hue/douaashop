"use server";

import { revalidatePath } from "next/cache";
import { addProduct, deleteProduct, updateProduct } from "@/lib/data-service";
import { Product } from "@/types";

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
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const product = await addProduct({
      ...data,
      slug,
      rating: 5.0,
      reviews_count: 1,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProductAction(id: string, updates: Partial<Product>) {
  try {
    const product = await updateProduct(id, updates);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProduct(id);
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
