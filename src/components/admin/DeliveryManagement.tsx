"use client";

import { useState, useTransition } from "react";
import { DeliveryPrice } from "@/types";
import { formatPrice } from "@/lib/utils";
import { updateDeliveryPriceAction } from "@/actions/delivery";
import { Truck, Check, Search, Save, AlertCircle, Sparkles } from "lucide-react";

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
            Tarifs de Livraison (58 Wilayas)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Modifiez instantanément les frais de livraison pour chaque wilaya sans redéployer votre site.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher wilaya ou code..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#5C1429]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-[#FDF1F3] border border-[#F6D5DC] flex items-center gap-3 text-xs text-[#5C1429]">
        <Truck className="w-5 h-5 shrink-0" />
        <span>
          Toute modification est immédiatement effective et appliquée en direct sur la page de commande client.
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
                <th className="px-5 py-3.5 text-right">Action</th>
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
                            <span>Enregistré !</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Enregistrer</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
