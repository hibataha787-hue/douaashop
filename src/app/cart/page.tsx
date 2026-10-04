"use client";

import Link from "next/link";
import Image from "next/image";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { t, language } = useLanguageStore();
  const subtotal = getSubtotal();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-10 bg-[#FCF8F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#5C1429]">
              {t.cartPage.title}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 underline font-medium cursor-pointer"
              >
                {t.cart.clearCart}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#F5D5DC] p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#FAF0F2] flex items-center justify-center mx-auto text-[#5C1429]">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900">
                {t.cart.empty}
              </h2>
              <p className="text-xs text-gray-500">
                {t.cart.emptySub}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5C1429] text-white text-xs font-bold hover:bg-[#480F20] transition-colors"
              >
                <span>{t.cartPage.discover}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-[#F5D5DC] shadow-xs"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-xl object-contain bg-[#FAF2F4] p-2"
                      width={96}
                      height={96}
                      unoptimized
                    />
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <Link
                        href={`/products/${item.product.slug || item.product.id}`}
                        className="font-bold text-sm text-gray-900 hover:text-[#5C1429] transition-colors"
                      >
                        {language === "ar" && item.product.name_ar
                          ? item.product.name_ar
                          : item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {t.cartPage.unitPrice} : {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-24 text-right text-sm font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title={t.cartPage.remove}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Box */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-[#F5D5DC] p-6 space-y-6 shadow-xs sticky top-28">
                  <h3 className="font-serif text-lg font-bold text-[#5C1429]">
                    {t.cartPage.orderSummary}
                  </h3>

                  <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>{t.cartPage.itemsSubtotal}</span>
                      <span className="font-bold text-gray-900">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison :</span>
                      <span className="text-gray-500 italic">
                        {t.cartPage.deliveryCalculated}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                      <span className="font-bold text-gray-900">{t.cartPage.estimatedTotal}</span>
                      <span className="font-bold text-lg text-[#5C1429]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-2xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>{t.cart.checkoutBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-500 justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.cartPage.cashOnDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
