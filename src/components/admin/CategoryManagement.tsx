"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Category } from "@/types";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  ImageIcon,
} from "lucide-react";

interface CategoryManagementProps {
  initialCategories: Category[];
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80";

export function CategoryManagement({
  initialCategories,
}: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [operationError, setOperationError] = useState("");

  // Form fields
  const [formName, setFormName] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formImage, setFormImage] = useState(DEFAULT_IMAGE);
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formOrder, setFormOrder] = useState<number>(99);
  const [formActive, setFormActive] = useState(true);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormNameAr("");
    setFormSlug("");
    setFormImage(DEFAULT_IMAGE);
    setFormSubtitle("");
    setFormOrder(categories.length + 1);
    setFormActive(true);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormNameAr(cat.name_ar || "");
    setFormSlug(cat.slug);
    setFormImage(cat.image);
    setFormSubtitle(cat.subtitle || "");
    setFormOrder(cat.display_order ?? 99);
    setFormActive(cat.active);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    startTransition(async () => {
      try {
        if (editingCategory) {
          const res = await updateCategoryAction(editingCategory.id, {
            name: formName,
            name_ar: formNameAr || undefined,
            slug: formSlug || undefined,
            image: formImage,
            subtitle: formSubtitle || undefined,
            display_order: formOrder,
            active: formActive,
          });

          if (res.success && res.category) {
            setCategories((prev) =>
              prev.map((c) =>
                c.id === editingCategory.id ? res.category! : c
              )
            );
            setIsModalOpen(false);
          } else {
            setErrorMsg(res.error || "Erreur lors de la modification.");
          }
        } else {
          const res = await createCategoryAction({
            name: formName,
            name_ar: formNameAr || undefined,
            slug: formSlug || undefined,
            image: formImage,
            subtitle: formSubtitle || undefined,
            display_order: formOrder,
            active: formActive,
          });

          if (res.success && res.category) {
            setCategories((prev) => [res.category!, ...prev]);
            setIsModalOpen(false);
          } else {
            setErrorMsg(res.error || "Erreur lors de la création.");
          }
        }
      } catch (error) {
        setErrorMsg(
          error instanceof Error ? error.message : "Impossible d'enregistrer la catégorie."
        );
      }
    });
  };

  const handleToggleActive = (cat: Category) => {
    startTransition(async () => {
      try {
        const next = !cat.active;
        const res = await updateCategoryAction(cat.id, { active: next });
        if (!res.success) {
          setOperationError(res.error ?? "Impossible de modifier le statut de la catégorie.");
          return;
        }
        setOperationError("");
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, active: next } : c))
        );
      } catch (error) {
        setOperationError(
          error instanceof Error ? error.message : "Impossible de modifier le statut de la catégorie."
        );
      }
    });
  };

  const handleDelete = (cat: Category) => {
    if (
      !confirm(
        `Supprimer la catégorie "${cat.name}" ? Les produits liés ne seront pas supprimés mais seront sans catégorie.`
      )
    )
      return;

    startTransition(async () => {
      try {
        const res = await deleteCategoryAction(cat.id);
        if (!res.success) {
          setOperationError(res.error ?? "Impossible de supprimer la catégorie.");
          return;
        }
        setOperationError("");
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } catch (error) {
        setOperationError(
          error instanceof Error ? error.message : "Impossible de supprimer la catégorie."
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      {operationError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          {operationError}
        </p>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C1429]">
            Gestion des Catégories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Créez, modifiez ou désactivez vos catégories de produits.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucune catégorie pour l&apos;instant</p>
          <p className="text-xs mt-1">Cliquez sur &quot;Ajouter une catégorie&quot; pour commencer.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#F5D5DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF5F6] text-gray-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Catégorie</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Ordre</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-[#FCF8F9] transition-colors ${
                      !cat.active ? "opacity-60 bg-gray-50/50" : ""
                    }`}
                  >
                    {/* Image + Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#FAF2F4] border border-gray-100 shrink-0"
                            width={48}
                            height={48}
                            unoptimized
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#FAF2F4] border border-gray-100 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{cat.name}</p>
                          {cat.name_ar && (
                            <p className="text-gray-400 text-[11px] mt-0.5" dir="rtl">
                              {cat.name_ar}
                            </p>
                          )}
                          {cat.subtitle && (
                            <p className="text-gray-400 text-[10px] mt-0.5 italic">
                              {cat.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-4 font-mono text-gray-500 text-[11px]">
                      /{cat.slug}
                    </td>

                    {/* Order */}
                    <td className="px-5 py-4 text-gray-600 font-semibold">
                      #{cat.display_order ?? "—"}
                    </td>

                    {/* Active toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          cat.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {cat.active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Masquée</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#5C1429] hover:bg-[#FAF0F2] transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F5D5DC] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#5C1429]">
                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Nom (français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Parfums"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] focus:outline-hidden focus:border-[#5C1429]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Nom (arabe)
                  </label>
                  <input
                    type="text"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="مثال: عطور"
                    dir="rtl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Slug + Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Slug URL
                    <span className="font-normal text-gray-400 ml-1">(auto si vide)</span>
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="parfums"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Sous-titre
                  <span className="font-normal text-gray-400 ml-1">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Ex: Fragrances orientales et occidentales"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Image de la catégorie *
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                />
                {formImage && (
                  <Image
                    src={formImage}
                    alt="Aperçu"
                    className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-100"
                    width={400}
                    height={96}
                    unoptimized
                  />
                )}
              </div>

              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-[#5C1429] focus:ring-[#5C1429]"
                />
                <span>Catégorie active (visible en boutique)</span>
              </label>

              {/* Error */}
              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                  ⚠ {errorMsg}
                </p>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {editingCategory ? "Enregistrer" : "Créer la catégorie"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
