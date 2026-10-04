"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { useCartStore } from "@/store/cart";
import { ALGERIA_WILAYAS } from "@/data/wilayas";
import { formatPrice } from "@/lib/utils";
import { createOrderAction } from "@/actions/orders";
import { ShieldCheck, Truck, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Default Alger (16)
  const [deliveryType, setDeliveryType] = useState<"home" | "stopdesk">("home");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const currentWilaya =
    ALGERIA_WILAYAS.find((w) => w.wilaya_code === selectedWilayaCode) ||
    ALGERIA_WILAYAS[15]; // fallback Alger

  const deliveryCost =
    deliveryType === "stopdesk" && currentWilaya.stopdesk_price
      ? currentWilaya.stopdesk_price
      : currentWilaya.home_price;

  const total = subtotal + deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Veuillez renseigner votre nom et prénom.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMessage("Veuillez saisir un numéro de téléphone valide (ex: 0550 12 34 56).");
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Veuillez indiquer votre adresse complète ou commune.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Votre panier est vide. Veuillez ajouter un produit.");
      return;
    }

    startTransition(async () => {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        wilayaCode: selectedWilayaCode,
        address: address.trim(),
        deliveryType,
        notes: notes.trim(),
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
      };

      const result = await createOrderAction(payload);

      if (result.success && result.order) {
        // Sauvegarder la commande pour la page de confirmation
        sessionStorage.setItem("last_order", JSON.stringify(result.order));
        sessionStorage.setItem("instagram_message", result.instagramMessage || "");
        sessionStorage.setItem("instagram_url", result.instagramUrl || "");

        clearCart();
        router.push("/confirmation");
      } else {
        setErrorMessage(result.error || "Une erreur est survenue lors de la validation.");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBanner />
        <Header />
        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md p-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Votre panier est vide
            </h2>
            <p className="text-xs text-gray-500">
              Ajoutez des articles à votre panier avant de procéder à la commande.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-full bg-[#5C1429] text-white text-xs font-bold"
            >
              Retour au catalogue
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-10 bg-[#FCF8F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#5C1429] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au panier</span>
            </Link>
          </div>

          <h1 className="font-serif italic text-3xl sm:text-4xl text-[#5C1429] mb-8">
            Validation de votre Commande
          </h1>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-fade-in">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Customer & Delivery Form */}
            <div className="lg:col-span-7">
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-[#F5D5DC] p-6 sm:p-8 space-y-6 shadow-xs"
              >
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-[#5C1429] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Informations du Destinataire
                  </h3>
                </div>

                {/* Nom et Prénom */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Nom et Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Amira Benali"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all bg-[#FAF5F6]"
                  />
                </div>

                {/* Numéro de téléphone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Numéro de Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: 0550 12 34 56 ou 06 / 07..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all bg-[#FAF5F6]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Le livreur vous appellera sur ce numéro avant la livraison.
                  </p>
                </div>

                {/* Wilaya Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Wilaya de Livraison (58 Wilayas) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all bg-[#FAF5F6] cursor-pointer"
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.wilaya_code} value={w.wilaya_code}>
                        {w.wilaya_code} - {w.wilaya_name} ({w.wilaya_name_ar}) — {formatPrice(w.home_price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type de livraison */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800">
                    Mode de livraison
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDeliveryType("home")}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        deliveryType === "home"
                          ? "border-[#5C1429] bg-[#FDF1F3]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "home"}
                        onChange={() => setDeliveryType("home")}
                        className="text-[#5C1429] focus:ring-[#5C1429]"
                      />
                      <div>
                        <span className="block text-xs font-bold text-gray-900">
                          À domicile
                        </span>
                        <span className="text-[11px] text-[#5C1429] font-semibold">
                          {formatPrice(currentWilaya.home_price)}
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setDeliveryType("stopdesk")}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        deliveryType === "stopdesk"
                          ? "border-[#5C1429] bg-[#FDF1F3]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "stopdesk"}
                        onChange={() => setDeliveryType("stopdesk")}
                        className="text-[#5C1429] focus:ring-[#5C1429]"
                      />
                      <div>
                        <span className="block text-xs font-bold text-gray-900">
                          Point relais (Stop Desk)
                        </span>
                        <span className="text-[11px] text-[#5C1429] font-semibold">
                          {formatPrice(currentWilaya.stopdesk_price || currentWilaya.home_price - 150)}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Adresse complète */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Commune et Adresse complète <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Cité 500 logts, Bâtiment B, Alger Centre"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all bg-[#FAF5F6]"
                  />
                </div>

                {/* Remarques */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800">
                    Remarques ou instructions particulières (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Me contacter de préférence après 14h..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all bg-[#FAF5F6]"
                  />
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#F5D5DC] p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-[#5C1429] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Récapitulatif de Commande
                  </h3>
                </div>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-gray-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-10 h-10 rounded-lg object-contain bg-[#FAF2F4] p-1 border border-gray-100"
                        />
                        <div>
                          <span className="font-bold text-gray-900 line-clamp-1">
                            {it.product.name}
                          </span>
                          <span className="text-gray-500">
                            Quantité : {it.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">
                        {formatPrice(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total articles :</span>
                    <span className="font-bold text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#5C1429]" />
                      Livraison ({currentWilaya.wilaya_name}) :
                    </span>
                    <span className="font-bold text-[#5C1429]">
                      {formatPrice(deliveryCost)}
                    </span>
                  </div>
                  <div className="border-t-2 border-[#F5D5DC] pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-gray-900">
                      Total à payer :
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#5C1429]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Payment badge */}
                <div className="p-3.5 rounded-xl bg-[#FDF1F3] border border-[#F5CAD4] flex items-center gap-2.5 text-xs text-[#5C1429]">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">
                    Paiement en espèces à la livraison après vérification de votre colis.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isPending}
                  className="w-full py-4 rounded-2xl bg-[#5C1429] hover:bg-[#480F20] disabled:bg-gray-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#F7BAC7]" />
                      <span>Confirmer la commande ({formatPrice(total)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
