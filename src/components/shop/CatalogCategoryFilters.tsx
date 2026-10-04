"use client";

import Link from "next/link";
import { Category } from "@/types";
import { useLanguageStore } from "@/store/language";

export function CatalogCategoryFilters({
  categories,
  selectedCategory,
  search,
  tag,
}: {
  categories: Category[];
  selectedCategory?: string;
  search?: string;
  tag?: string;
}) {
  const { language, t } = useLanguageStore();
  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
      <Link
        href={categoryHref()}
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
          !selectedCategory
            ? "bg-[#5C1429] text-white shadow-xs"
            : "bg-white border border-[#F5D5DC] text-gray-700 hover:border-[#5C1429]"
        }`}
      >
        {t.catalog.all}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryHref(category.slug)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === category.slug
              ? "bg-[#5C1429] text-white shadow-xs"
              : "bg-white border border-[#F5D5DC] text-gray-700 hover:border-[#5C1429]"
          }`}
        >
          {language === "ar" && category.name_ar
            ? category.name_ar
            : category.name}
        </Link>
      ))}
    </div>
  );
}
