"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useLanguageStore } from "@/store/language";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
  } = useCartStore();

  const { t } = useLanguageStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#F5D0D7]">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FDF4F6]">
            <div className="flex items-center gap-2 text-[#5C1429]">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold">
                {t.cart.title} ({items.length})
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF0F2] flex items-center justify-center mx-auto text-[#5C1429]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-serif text-base font-bold text-gray-800">
                  {t.cart.empty}
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {t.cart.emptySub}
                </p>
                <button
                  onClick={closeDrawer}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#5C1429] text-white text-xs font-semibold hover:bg-[#480F20] transition-colors cursor-pointer"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#F6DCE2] bg-white hover:border-[#5C1429]/30 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-contain bg-[#FAF2F4] p-1 border border-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-[#5C1429] mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-[#FCF7F8] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">{t.cart.subtotal}</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {t.cart.deliveryEst}
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>{t.cart.checkoutBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E9B8C5] text-[#5C1429] hover:bg-[#FDF4F6] text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  Voir les détails du panier
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
