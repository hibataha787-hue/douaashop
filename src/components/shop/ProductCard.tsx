"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";
import { useFavoritesStore } from "@/store/favorites";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isLiked = useFavoritesStore((state) =>
    state.productIds.includes(product.id)
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const { language, t } = useLanguageStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const displayName = language === "ar" && product.name_ar ? product.name_ar : product.name;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#F3D3DB] overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-[#5C1429]/50">
      {/* Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {product.badge ? (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xs pointer-events-auto ${
              product.badge === "Nouveau"
                ? "bg-[#C0392B]"
                : product.badge.startsWith("-")
                ? "bg-[#5C1429]"
                : "bg-[#8E44AD]"
            }`}
          >
            {product.badge}
          </span>
        ) : (
          <div />
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs hover:scale-110 transition-all pointer-events-auto cursor-pointer ${
            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="block relative w-full aspect-square overflow-hidden bg-[#FAF2F4] p-4"
      >
        <Image
          src={product.image}
          alt={displayName}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="text-sm font-bold text-gray-900 hover:text-[#5C1429] line-clamp-1 transition-colors"
          title={displayName}
        >
          {displayName}
        </Link>

        {/* Rating Stars & Count */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5)
                    ? "fill-current"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            ({product.reviews_count || 12})
          </span>
        </div>

        {/* Stock Indicator */}
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`w-2 h-2 rounded-full ${
              product.in_stock ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-[11px] font-medium ${
              product.in_stock ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {product.in_stock ? t.popular.inStock : t.product.outOfStock}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.old_price && product.old_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>

        {/* Add to Cart CTA Button */}
        <div className="mt-4 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer ${
              !product.in_stock
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#5C1429] hover:bg-[#480F20] text-white hover:shadow-md"
            }`}
          >
            {!product.in_stock ? (
              <span>{t.product.outOfStock}</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.popular.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t.popular.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
