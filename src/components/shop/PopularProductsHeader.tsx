"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export function PopularProductsHeader() {
  const { t } = useLanguageStore();
  return (
    <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#F5D5DC]">
      <div className="flex items-center gap-4">
        <h2 className="font-serif italic text-2xl sm:text-3xl text-[#5C1429] font-normal">
          {t.popular.title}
        </h2>
        <div className="hidden sm:block h-px w-20 bg-[#F2C2CD]" />
      </div>
      <Link
        href="/products"
        className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C1429] hover:text-[#7A1F39] transition-colors"
      >
        <span>{t.popular.viewAll}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
