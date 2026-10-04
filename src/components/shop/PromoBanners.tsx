"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export function PromoBanners() {
  const { t } = useLanguageStore();

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Parfums */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5C1429] via-[#751B35] to-[#8C2341] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[260px] shadow-lg group">
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="text-[11px] tracking-widest uppercase font-semibold text-[#F7BAC7]">
                {t.banners.perfumesTag}
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl font-normal leading-tight">
                {t.banners.perfumesTitle}
              </h3>
              <div className="pt-3">
                <Link
                  href="/products?category=parfums"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#5C1429] hover:bg-[#FDECEF] text-xs font-bold transition-all shadow-md group-hover:gap-3"
                >
                  <span>{t.banners.perfumesCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Background Image / Decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
                alt="Parfums d'exception"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#5C1429] via-[#5C1429]/50 to-transparent" />
            </div>
          </div>

          {/* Banner 2: Soins de la peau */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FDE8EB] via-[#FAD3DC] to-[#F8BAC7] text-gray-900 p-8 sm:p-10 flex flex-col justify-between min-h-[260px] shadow-lg border border-[#F3BDC9] group">
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="text-[11px] tracking-widest uppercase font-semibold text-[#7A1F39]">
                {t.banners.skincareTag}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#5C1429] leading-tight">
                {t.banners.skincareTitle}
              </h3>
              <div className="pt-3">
                <Link
                  href="/products?category=soins-visage"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5C1429] text-white hover:bg-[#480F20] text-xs font-bold transition-all shadow-md group-hover:gap-3"
                >
                  <span>{t.banners.skincareCta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Background Image / Decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-90 group-hover:scale-105 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
                alt="Soin de la peau"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDE8EB] via-[#FDE8EB]/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
