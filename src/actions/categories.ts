"use server";

import { revalidatePath } from "next/cache";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/data-service";
import { Category } from "@/types";

export async function createCategoryAction(data: {
  name: string;
  name_ar?: string;
  slug?: string;
  image: string;
  subtitle?: string;
  subtitle_ar?: string;
  display_order?: number;
  active: boolean;
}) {
  try {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const category = await addCategory({
      ...data,
      slug,
      active: data.active ?? true,
      display_order: data.display_order ?? 99,
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return { success: true, category };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCategoryAction(
  id: string,
  updates: Partial<Category>
) {
  try {
    const category = await updateCategory(id, updates);
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true, category };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
