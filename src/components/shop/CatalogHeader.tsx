"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category } from "@/types";
import { useLanguageStore } from "@/store/language";

interface CatalogHeaderProps {
  category?: Category;
  search?: string;
  tag?: string;
  count: number;
}

export function CatalogHeader({
  category,
  search,
  tag,
  count,
}: CatalogHeaderProps) {
  const { language, t } = useLanguageStore();
  const categoryName =
    language === "ar" && category?.name_ar ? category.name_ar : category?.name;
  const title = categoryName
    ? categoryName
    : search
      ? `${t.catalog.resultPrefix} «${search}»`
      : tag === "promotions"
        ? t.catalog.promotions
        : tag === "nouveautes"
          ? t.catalog.newArrivals
          : t.catalog.collection;

  return (
    <>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#5C1429]">
          {t.productDetail.home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#5C1429] font-medium">{t.catalog.breadcrumb}</span>
        {categoryName && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-semibold">{categoryName}</span>
          </>
        )}
      </div>

      <div className="mb-8">
        <h1 className="font-serif italic text-3xl sm:text-4xl text-[#5C1429]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {count} {count === 1 ? t.catalog.productSingular : t.catalog.productPlural}{" "}
          {t.catalog.available}
        </p>
      </div>
    </>
  );
}
