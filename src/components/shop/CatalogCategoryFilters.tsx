"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <section aria-label={t.categories.title} className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-[#5C1429] sm:text-lg">
          {t.categories.title}
        </h2>
      </div>

      <div className="relative">
        <div
          ref={categoriesRef}
          className="scrollbar-none flex snap-x snap-mandatory items-center gap-2 overflow-x-auto scroll-smooth pb-3"
        >
          <Link
            href={categoryHref()}
            className={`shrink-0 snap-start rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              !selectedCategory
                ? "bg-[#5C1429] text-white shadow-xs"
                : "border border-[#F5D5DC] bg-white text-gray-700 hover:border-[#5C1429]"
            }`}
          >
            {t.catalog.all}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category.slug)}
              className={`shrink-0 snap-start rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.slug
                  ? "bg-[#5C1429] text-white shadow-xs"
                  : "border border-[#F5D5DC] bg-white text-gray-700 hover:border-[#5C1429]"
              }`}
            >
              {language === "ar" && category.name_ar
                ? category.name_ar
                : category.name}
            </Link>
          ))}
        </div>
        <div
          className={`pointer-events-none absolute inset-y-0 ${language === "ar" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"} from-[#FCF8F9]/0 to-[#FCF8F9] sm:hidden`}
        />
        <button
          type="button"
          aria-label={t.categories.scroll}
          onClick={() =>
            categoriesRef.current?.scrollBy({
              left: language === "ar" ? -220 : 220,
              behavior: "smooth",
            })
          }
          className={`category-carousel-arrow absolute ${language === "ar" ? "left-0" : "right-0"} top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#5C1429] shadow-md ring-1 ring-[#F5D5DC] sm:hidden min-[400px]:flex`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
