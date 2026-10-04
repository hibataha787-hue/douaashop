"use server";

import { revalidatePath } from "next/cache";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/data-service";
import { requireAdmin } from "@/lib/supabase/admin";
import { Category } from "@/types";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  name_ar: z.string().trim().max(100).optional(),
  slug: z.string().trim().max(120).optional(),
  image: z.string().url().max(2048),
  subtitle: z.string().max(255).optional(),
  subtitle_ar: z.string().max(255).optional(),
  display_order: z.number().int().min(0).max(10000).optional(),
  active: z.boolean(),
});

const CategoryUpdateSchema = CategorySchema.partial().refine(
  (updates) => Object.keys(updates).length > 0,
  "Aucune modification à enregistrer."
);

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

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
    await requireAdmin();
    const validated = CategorySchema.parse(data);
    const slug =
      createSlug(validated.slug || validated.name);
    if (!slug) {
      throw new Error("Le nom de catégorie doit contenir des lettres ou des chiffres.");
    }

    const category = await addCategory({
      ...validated,
      slug,
      active: validated.active ?? true,
      display_order: validated.display_order ?? 99,
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return { success: true, category };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la création de la catégorie.",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  updates: Partial<Category>
) {
  try {
    await requireAdmin();
    const validatedId = z.string().uuid().parse(id);
    const validatedUpdates = CategoryUpdateSchema.parse(updates);
    const slug =
      validatedUpdates.slug === undefined
        ? undefined
        : createSlug(validatedUpdates.slug);
    if (slug !== undefined && !slug) {
      throw new Error("Le slug doit contenir des lettres ou des chiffres.");
    }
    const category = await updateCategory(validatedId, {
      ...validatedUpdates,
      ...(slug !== undefined ? { slug } : {}),
    });
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true, category };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la modification de la catégorie.",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await requireAdmin();
    await deleteCategory(z.string().uuid().parse(id));
    revalidatePath("/");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur lors de la suppression de la catégorie.",
    };
  }
}
