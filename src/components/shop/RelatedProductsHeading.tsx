"use client";

import { useLanguageStore } from "@/store/language";

export function RelatedProductsHeading() {
  const { t } = useLanguageStore();
  return (
    <h3 className="font-serif italic text-2xl text-[#5C1429] mb-6">
      {t.product.related}
    </h3>
  );
}
