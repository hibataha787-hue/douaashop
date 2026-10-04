"use client";

import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ProductDetailActions } from "@/components/shop/ProductDetailActions";
import { useLanguageStore } from "@/store/language";
import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

export function ProductInformation({ product }: { product: Product }) {
  const { language, t } = useLanguageStore();
  const productName =
    language === "ar" && product.name_ar ? product.name_ar : product.name;
  const categoryName =
    language === "ar" && product.category_name_ar
      ? product.category_name_ar
      : product.category_name;
  const description =
    language === "ar" && product.description_ar
      ? product.description_ar
      : product.description;

  return (
    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
      <div className="space-y-4" dir={language === "ar" ? "rtl" : "ltr"}>
        {categoryName && (
          <span className="text-xs uppercase tracking-wider font-bold text-[#8C2341]">
            {categoryName}
          </span>
        )}

        <h1 className="font-serif text-3xl sm:text-4xl text-[#5C1429] font-bold">
          {productName}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center text-amber-500 font-bold">
            ★ {product.rating || "5.0"}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">
            {product.reviews_count || 0} {t.product.verifiedReviews}
          </span>
          <span className="text-gray-400">|</span>
          <span
            className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-0.5 rounded-full ${
              product.in_stock
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-700 bg-red-50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                product.in_stock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {product.in_stock ? t.product.inStock : t.product.outOfStock}
          </span>
        </div>

        <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.old_price != null && product.old_price > product.price && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.old_price)}
            </span>
          )}
          {product.old_price != null && product.old_price > product.price && (
            <span className="text-xs font-bold text-[#5C1429] bg-[#FDECEF] px-2 py-0.5 rounded-md">
              {t.product.savings} {formatPrice(product.old_price - product.price)}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-700 leading-relaxed pt-2">
          <p>{description}</p>
        </div>
      </div>

      <ProductDetailActions product={product} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#5C1429]" />
          <span>{t.product.delivery}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#5C1429]" />
          <span>{t.product.payment}</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#5C1429]" />
          <span>{t.product.authentic}</span>
        </div>
      </div>
    </div>
  );
}
