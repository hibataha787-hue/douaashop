"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { formatPrice } from "@/lib/utils";
import { OrderSummary } from "@/types";
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useLanguageStore } from "@/store/language";

export default function ConfirmationPage() {
  const { t } = useLanguageStore();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [instagramMessage, setInstagramMessage] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState(
    "https://www.instagram.com/douaa_shop.0/"
  );
  const [isCopied, setIsCopied] = useState(false);
  const [instagramStatus, setInstagramStatus] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedOrder = sessionStorage.getItem("last_order");
        const storedMsg = sessionStorage.getItem("instagram_message");
        const storedUrl = sessionStorage.getItem("instagram_url");

        if (storedOrder) {
          setOrder(JSON.parse(storedOrder) as OrderSummary);
          try {
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ["#5C1429", "#BA375D", "#F8BAC7", "#D4AF37", "#fff"],
            });
          } catch (error) {
            console.error("Impossible d'afficher l'animation de confirmation :", error);
          }
        }
        if (storedMsg) setInstagramMessage(storedMsg);
        if (storedUrl?.startsWith("https://")) setInstagramUrl(storedUrl);
        sessionStorage.removeItem("last_order");
        sessionStorage.removeItem("instagram_message");
        sessionStorage.removeItem("instagram_url");
      } catch (error) {
        console.error("Impossible de charger le récapitulatif de commande :", error);
        setInstagramStatus(
          "Le récapitulatif de commande n'a pas pu être chargé sur cet appareil."
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const copyInstagramMessage = async () => {
    if (!instagramMessage) {
      throw new Error("Aucun message de commande à copier.");
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(instagramMessage);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = instagramMessage;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) {
      throw new Error("La copie automatique n'est pas disponible sur cet appareil.");
    }
  };

  const handleCopyMessage = async () => {
    try {
      await copyInstagramMessage();
      setIsCopied(true);
      setInstagramStatus(t.confirmation.copySuccess);
      window.setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(false);
      setInstagramStatus(
        `${t.confirmation.copyError} ${t.confirmation.copyManually}`
      );
    }
  };

  const handleOpenInstagram = () => {
    const copyPromise = handleCopyMessage();
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
    void copyPromise;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-8 sm:py-12 bg-[#FCF8F9]/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-[#F5D5DC] p-6 sm:p-10 shadow-sm text-center space-y-6 card-enter">

            {/* Success Icon */}
            <div
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto pulse-glow ${
                order
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : "bg-amber-50 border-amber-100 text-amber-700"
              }`}
            >
              {order ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <AlertCircle className="w-10 h-10" />
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-serif italic text-2xl sm:text-4xl text-[#5C1429] leading-tight">
                {order ? t.confirmation.title : t.confirmation.noOrder}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                {order
                  ? `${t.confirmation.thankYou} ${t.confirmation.instruction}`
                  : t.confirmation.noOrderInstruction}
              </p>
            </div>

            {/* Order Reference */}
            {order && (
              <div className="inline-block px-4 py-2 rounded-xl bg-[#FAF2F4] border border-[#F5CAD4]">
                <span className="text-xs text-gray-500">{t.confirmation.orderRef} </span>
                <span className="font-mono text-xs font-bold text-[#5C1429]">
                  #{order.orderNumber}
                </span>
              </div>
            )}

            {/* Instagram Action Block */}
            {instagramMessage && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FDF1F3] via-[#FDE8EB] to-[#FCE4E9] border-2 border-[#F6BCC9] text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#5C1429]">
                      {t.confirmation.messageHeading}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {t.confirmation.pasteToInstagram}
                    </p>
                  </div>
                </div>

              {/* Message Preview */}
              {instagramMessage && (
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-white/90 border border-[#F2CAD3] text-[11px] font-sans text-gray-800 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {instagramMessage}
                  </pre>
                  <button
                    onClick={handleCopyMessage}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-[#5C1429] hover:bg-[#480F20] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <><Check className="w-3 h-3 text-emerald-300" /><span>{t.confirmation.copied}</span></>
                    ) : (
                      <><Copy className="w-3 h-3" /><span>{t.confirmation.copyMessage}</span></>
                    )}
                  </button>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOpenInstagram}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D62976] via-[#962FBF] to-[#4F5BD5] hover:opacity-95 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>{t.confirmation.sendInstagramBtn}</span>
                </button>
                <button
                  onClick={handleCopyMessage}
                  className="py-3 px-4 rounded-xl bg-white border border-[#F3BDC9] hover:bg-[#FAF0F2] active:scale-[0.98] text-xs font-bold text-[#5C1429] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? t.confirmation.copied : t.confirmation.copyMessage}</span>
                </button>
              </div>
              </div>
            )}
            {instagramStatus && (
              <p role="status" className="text-xs font-semibold text-[#5C1429]">
                {instagramStatus}
              </p>
            )}

            {/* Delivery Summary */}
            {order && (
              <div className="p-5 rounded-2xl bg-[#FCF8F9] border border-[#F5D5DC] text-left space-y-3">
                <h4 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  {t.confirmation.deliverySummary}
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#5C1429] shrink-0" />
                    <span>{order.customerName} — {order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#5C1429] shrink-0 mt-0.5" />
                    <span>
                      {order.address}, {order.wilayaName}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700">
                    {t.confirmation.totalAtDelivery}
                  </span>
                  <span className="font-serif text-xl font-bold text-[#5C1429]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            )}

            {/* Back Home */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#5C1429] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.confirmation.backToShop}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
