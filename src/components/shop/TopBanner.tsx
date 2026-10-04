"use client";

import Link from "next/link";
import { Truck, ShieldCheck, CreditCard, Globe } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useLanguageStore } from "@/store/language";

export function TopBanner() {
  const { language, toggleLanguage, t } = useLanguageStore();

  return (
    <div className="bg-[#420E1D] text-[#FDE8EB] text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Reassurance points */}
        <div className="flex items-center gap-6 overflow-x-auto py-0.5 scrollbar-none">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5 text-[#F8BAC7]" />
            <span>{t.topBanner.delivery}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
            <CreditCard className="w-3.5 h-3.5 text-[#F8BAC7]" />
            <span>{t.topBanner.payment}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F8BAC7]" />
            <span>{t.topBanner.authentic}</span>
          </div>
        </div>

        {/* Social Links & Language Switcher */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#F8BAC7] hidden sm:inline">{t.topBanner.followUs}</span>
            <a
              href="https://www.instagram.com/douaa_shop.0?stkn=ZnZnMW5yc2hzZzV6"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-white transition-colors"
              title="Instagram Douaa Shop"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="h-3 w-px bg-[#7A2A3D]" />

          {/* Switch FR / AR */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#5A1428] hover:bg-[#6E1C33] text-[#FFF] font-medium transition-all cursor-pointer"
            title="Changer de langue / تغيير اللغة"
          >
            <Globe className="w-3 h-3 text-[#F8BAC7]" />
            <span>{language === "fr" ? "العربية" : "FR"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
