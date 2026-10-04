"use client";

import { useState, useTransition } from "react";
import { Product, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/actions/products";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
  Loader2,
} from "lucide-react";

interface ProductManagementProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductManagement({
  initialProducts,
  categories,
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState<number>(3000);
  const [formOldPrice, setFormOldPrice] = useState<number | undefined>(undefined);
  const [formCategoryId, setFormCategoryId] = useState(
    categories[0]?.id || "cat-parfums"
  );
  const [formImage, setFormImage] = useState(
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  );
  const [formBadge, setFormBadge] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);

  // Editing inline price state
  const [inlinePriceEditId, setInlinePriceEditId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice(3000);
    setFormOldPrice(undefined);
    setFormCategoryId(categories[0]?.id || "cat-parfums");
    setFormImage(
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    );
    setFormBadge("");
    setFormDescription("");
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormOldPrice(p.old_price);
    setFormCategoryId(p.category_id);
    setFormImage(p.image);
    setFormBadge(p.badge || "");
    setFormDescription(p.description);
    setFormActive(p.active);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      if (editingProduct) {
        // Edit existing
        const res = await updateProductAction(editingProduct.id, {
          name: formName,
          price: Number(formPrice),
          old_price: formOldPrice ? Number(formOldPrice) : undefined,
          category_id: formCategoryId,
          image: formImage,
          badge: formBadge || undefined,
          description: formDescription,
          active: formActive,
        });

        if (res.success && res.product) {
          setProducts((prev) =>
            prev.map((item) => (item.id === editingProduct.id ? res.product! : item))
          );
          setIsModalOpen(false);
        }
      } else {
        // Create new
        const res = await createProductAction({
          name: formName,
          price: Number(formPrice),
          old_price: formOldPrice ? Number(formOldPrice) : undefined,
          category_id: formCategoryId,
          image: formImage,
          badge: formBadge || undefined,
          description: formDescription,
          in_stock: true,
          active: formActive,
        });

        if (res.success && res.product) {
          setProducts((prev) => [res.product!, ...prev]);
          setIsModalOpen(false);
        }
      }
    });
  };

  const handleToggleActive = (product: Product) => {
    startTransition(async () => {
      const nextActive = !product.active;
      const res = await updateProductAction(product.id, { active: nextActive });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, active: nextActive } : p))
        );
      }
    });
  };

  const handleDelete = (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    });
  };

  const handleSaveInlinePrice = (productId: string) => {
    startTransition(async () => {
      const res = await updateProductAction(productId, { price: inlinePriceValue });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, price: inlinePriceValue } : p))
        );
        setInlinePriceEditId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C1429]">
            Gestion des Produits & Prix
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ajoutez de nouveaux cosmétiques, ajustez vos prix sans redéployer et gérez l&apos;affichage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#F5D5DC] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF5F6] text-gray-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Produit</th>
                <th className="px-5 py-3.5">Catégorie</th>
                <th className="px-5 py-3.5">Prix Actuel</th>
                <th className="px-5 py-3.5">Ancien Prix</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const categoryObj = categories.find((c) => c.id === product.category_id);
                const isEditingThisPrice = inlinePriceEditId === product.id;

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-[#FCF8F9] transition-colors ${
                      !product.active ? "opacity-60 bg-gray-50/50" : ""
                    }`}
                  >
                    {/* Image & Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-[#FAF2F4] p-1 border border-gray-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-xs line-clamp-1">
                            {product.name}
                          </p>
                          {product.badge && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#5C1429] text-white">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      {categoryObj?.name || product.category_name || "Général"}
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="px-5 py-4">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={inlinePriceValue}
                            onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border rounded-lg bg-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlinePrice(product.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setInlinePriceEditId(null)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setInlinePriceEditId(product.id);
                            setInlinePriceValue(product.price);
                          }}
                          className="font-bold text-gray-900 hover:text-[#5C1429] hover:underline flex items-center gap-1.5 cursor-pointer"
                          title="Cliquez pour modifier le prix"
                        >
                          <span>{formatPrice(product.price)}</span>
                          <Edit2 className="w-3 h-3 text-gray-400 opacity-60" />
                        </button>
                      )}
                    </td>

                    {/* Old Price */}
                    <td className="px-5 py-4 text-gray-400">
                      {product.old_price ? formatPrice(product.old_price) : "-"}
                    </td>

                    {/* Active / Inactive Switch */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          product.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {product.active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>En ligne</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#5C1429] hover:bg-[#FAF0F2] transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F5D5DC] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#5C1429]">
                {editingProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Yara Lattafa 100ml"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] focus:outline-hidden focus:border-[#5C1429]"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Catégorie *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge (Optionnel)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Ex: -20% ou Nouveau"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Prix de vente (DA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Ancien prix barré (Optionnel)</label>
                  <input
                    type="number"
                    min={0}
                    value={formOldPrice || ""}
                    onChange={(e) =>
                      setFormOldPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Ex: 6200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Lien Image du produit *</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Notes olfactives, bienfaits pour la peau..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                />
              </div>

              {/* Visibility Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-[#5C1429] focus:ring-[#5C1429]"
                />
                <span>Publier immédiatement sur la boutique (Actif)</span>
              </label>

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
                  <span>{editingProduct ? "Enregistrer les modifications" : "Publier l'article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
