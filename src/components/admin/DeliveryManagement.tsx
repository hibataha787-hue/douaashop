"use client";

import { useState, useTransition } from "react";
import { DeliveryPrice } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  updateDeliveryPriceAction,
  addDeliveryWilayaAction,
  deleteDeliveryWilayaAction,
} from "@/actions/delivery";
import {
  Truck,
  Check,
  Search,
  Save,
  Plus,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

interface DeliveryManagementProps {
  initialWilayas: DeliveryPrice[];
}

export function DeliveryManagement({ initialWilayas }: DeliveryManagementProps) {
  const [wilayas, setWilayas] = useState<DeliveryPrice[]>(initialWilayas);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPrices, setEditingPrices] = useState<{
    [code: number]: { home: number; stopdesk?: number };
  }>({});
  const [savedCodes, setSavedCodes] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  // Add Wilaya Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCode, setFormCode] = useState<number>(59);
  const [formName, setFormName] = useState("");
  const [formNameAr, setFormNameAr] = useState("");
  const [formHome, setFormHome] = useState<number>(600);
  const [formStopdesk, setFormStopdesk] = useState<number>(400);
  const [formError, setFormError] = useState("");

  const handlePriceChange = (
    code: number,
    field: "home" | "stopdesk",
    value: number
  ) => {
    setEditingPrices((prev) => ({
      ...prev,
      [code]: {
        home:
          field === "home"
            ? value
            : prev[code]?.home ??
              (wilayas.find((w) => w.wilaya_code === code)?.home_price || 600),
        stopdesk:
          field === "stopdesk"
            ? value
            : prev[code]?.stopdesk ??
              (wilayas.find((w) => w.wilaya_code === code)?.stopdesk_price || 400),
      },
    }));
  };

  const handleSaveRow = (w: DeliveryPrice) => {
    const currentEdit = editingPrices[w.wilaya_code];
    const newHome = currentEdit?.home ?? w.home_price;
    const newStopdesk = currentEdit?.stopdesk ?? w.stopdesk_price;

    startTransition(async () => {
      const res = await updateDeliveryPriceAction(
        w.wilaya_code,
        newHome,
        newStopdesk
      );
      if (res.success) {
        setWilayas((prev) =>
          prev.map((item) =>
            item.wilaya_code === w.wilaya_code
              ? { ...item, home_price: newHome, stopdesk_price: newStopdesk }
              : item
          )
        );
        setSavedCodes((prev) => [...prev, w.wilaya_code]);
        setTimeout(() => {
          setSavedCodes((prev) => prev.filter((c) => c !== w.wilaya_code));
        }, 2000);
      }
    });
  };

  const handleDelete = (w: DeliveryPrice) => {
    if (!confirm(`Supprimer la wilaya "${w.wilaya_name}" (${String(w.wilaya_code).padStart(2, "0")}) ?`))
      return;
    startTransition(async () => {
      const res = await deleteDeliveryWilayaAction(w.wilaya_code);
      if (res.success) {
        setWilayas((prev) => prev.filter((item) => item.wilaya_code !== w.wilaya_code));
      }
    });
  };

  const openAddModal = () => {
    const maxCode = Math.max(0, ...wilayas.map((w) => w.wilaya_code));
    setFormCode(maxCode + 1);
    setFormName("");
    setFormNameAr("");
    setFormHome(600);
    setFormStopdesk(400);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleAddWilaya = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (wilayas.some((w) => w.wilaya_code === formCode)) {
      setFormError(`Le code ${formCode} existe déjà.`);
      return;
    }

    startTransition(async () => {
      const res = await addDeliveryWilayaAction({
        wilaya_code: formCode,
        wilaya_name: formName,
        wilaya_name_ar: formNameAr,
        home_price: formHome,
        stopdesk_price: formStopdesk,
        active: true,
      });

      if (res.success && res.wilaya) {
        setWilayas((prev) =>
          [...prev, res.wilaya!].sort((a, b) => a.wilaya_code - b.wilaya_code)
        );
        setIsModalOpen(false);
      } else {
        setFormError(res.error || "Erreur lors de l'ajout.");
      }
    });
  };

  const filteredWilayas = wilayas.filter(
    (w) =>
      w.wilaya_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.wilaya_name_ar.includes(searchTerm) ||
      w.wilaya_code.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C1429]">
            Tarifs de Livraison ({wilayas.length} Wilayas)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Modifiez instantanément les frais de livraison pour chaque wilaya.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative w-48">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#5C1429]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Add Button */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une wilaya</span>
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-[#FDF1F3] border border-[#F6D5DC] flex items-center gap-3 text-xs text-[#5C1429]">
        <Truck className="w-5 h-5 shrink-0" />
        <span>
          Toute modification est immédiatement effective sur la page de commande client.
        </span>
      </div>

      {/* Wilayas Table */}
      <div className="bg-white rounded-3xl border border-[#F5D5DC] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF5F6] text-gray-700 font-bold uppercase text-[10px] sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Wilaya</th>
                <th className="px-5 py-3.5">Nom Arabe</th>
                <th className="px-5 py-3.5">À Domicile (DA)</th>
                <th className="px-5 py-3.5">Stop Desk (DA)</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWilayas.map((w) => {
                const currentEdit = editingPrices[w.wilaya_code];
                const homeValue = currentEdit?.home ?? w.home_price;
                const stopdeskValue = currentEdit?.stopdesk ?? (w.stopdesk_price || 400);
                const isSaved = savedCodes.includes(w.wilaya_code);
                const hasChanges =
                  currentEdit?.home !== undefined || currentEdit?.stopdesk !== undefined;

                return (
                  <tr key={w.wilaya_code} className="hover:bg-[#FCF8F9] transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-[#5C1429]">
                      {w.wilaya_code < 10 ? `0${w.wilaya_code}` : w.wilaya_code}
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">
                      {w.wilaya_name}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-600">
                      {w.wilaya_name_ar}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={homeValue}
                          onChange={(e) =>
                            handlePriceChange(w.wilaya_code, "home", Number(e.target.value))
                          }
                          className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 bg-[#FAF5F6] focus:bg-white focus:border-[#5C1429]"
                        />
                        <span className="text-[11px] text-gray-500 font-semibold">DA</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={stopdeskValue}
                          onChange={(e) =>
                            handlePriceChange(w.wilaya_code, "stopdesk", Number(e.target.value))
                          }
                          className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 bg-[#FAF5F6] focus:bg-white focus:border-[#5C1429]"
                        />
                        <span className="text-[11px] text-gray-500 font-semibold">DA</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSaveRow(w)}
                          disabled={isPending}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                            isSaved
                              ? "bg-emerald-600 text-white"
                              : hasChanges
                              ? "bg-[#5C1429] hover:bg-[#480F20] text-white shadow-xs"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Sauvegardé !</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Sauvegarder</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(w)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer cette wilaya"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add Wilaya Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#F5D5DC] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#5C1429]">
                Ajouter une Wilaya
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWilaya} className="space-y-4">
              {/* Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Code Wilaya *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={formCode}
                  onChange={(e) => setFormCode(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6] font-mono"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Nom (français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Alger"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Nom (arabe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="الجزائر"
                    dir="rtl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Livraison Domicile (DA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formHome}
                    onChange={(e) => setFormHome(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Stop Desk (DA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStopdesk}
                    onChange={(e) => setFormStopdesk(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-[#FAF5F6]"
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                  ⚠ {formError}
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
                  <span>Ajouter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

