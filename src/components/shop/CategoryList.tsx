"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { useLanguageStore } from "@/store/language";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const { language, t } = useLanguageStore();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="font-serif italic text-2xl sm:text-3xl text-[#5C1429] font-normal">
              {t.categories.title}
            </h2>
            <div className="hidden sm:block h-px w-20 bg-[#F2C2CD]" />
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C1429] hover:text-[#7A1F39] transition-colors"
          >
            <span>{t.categories.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Circular Staged Image Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-br from-[#FCE8EB] to-[#FAD4DC] border-2 border-[#F6C0CB] group-hover:border-[#5C1429] shadow-xs group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    width={144}
                    height={144}
                    unoptimized
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <span className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#5C1429] transition-colors">
                {language === "ar" && cat.name_ar ? cat.name_ar : cat.name}
              </span>
              <span className="text-[11px] text-gray-500 line-clamp-1 max-w-[130px] font-normal">
                {language === "ar" && cat.subtitle_ar ? cat.subtitle_ar : cat.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
