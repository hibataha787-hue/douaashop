"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language";

export function CatalogEmptyState() {
  const { t } = useLanguageStore();
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-[#F5D5DC] p-8">
      <p className="text-gray-500 text-sm">{t.catalog.noResults}</p>
      <Link
        href="/products"
        className="mt-4 inline-block px-5 py-2.5 rounded-full bg-[#5C1429] text-white text-xs font-semibold"
      >
        {t.catalog.all}
      </Link>
    </div>
  );
}
