"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { useLanguageStore } from "@/store/language";

export function ProductBreadcrumb({ product }: { product: Product }) {
  const { language, t } = useLanguageStore();

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
      <Link href="/" className="hover:text-[#5C1429]">
        {t.productDetail.home}
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <Link href="/products" className="hover:text-[#5C1429]">
        {t.productDetail.catalog}
      </Link>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-[#5C1429] font-medium truncate max-w-[200px]">
        {language === "ar" && product.name_ar ? product.name_ar : product.name}
      </span>
    </div>
  );
}
