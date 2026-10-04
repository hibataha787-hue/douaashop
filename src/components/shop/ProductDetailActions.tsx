"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap, Check } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguageStore();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-gray-700">{t.product.quantity}</span>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
            !product.in_stock
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : isAdded
              ? "bg-emerald-600 text-white"
              : "bg-white border-2 border-[#5C1429] text-[#5C1429] hover:bg-[#FDF4F6]"
          }`}
        >
        {!product.in_stock ? (
          <span>{t.product.outOfStock}</span>
        ) : isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t.product.addedToCart}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{t.product.addToCart}</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!product.in_stock}
          className="py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 bg-[#5C1429] hover:bg-[#480F20] text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          <span>{t.product.buyNow}</span>
        </button>
      </div>
    </div>
  );
}
