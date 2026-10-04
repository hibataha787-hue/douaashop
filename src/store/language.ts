"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, translations } from "@/lib/i18n";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.fr;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "fr",
      setLanguage: (lang) => {
        set({
          language: lang,
          t: translations[lang]
        });
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        }
      },
      toggleLanguage: () => {
        const next = get().language === "fr" ? "ar" : "fr";
        get().setLanguage(next);
      },
      t: translations.fr
    }),
    {
      name: "douaa-shop-language",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.lang = state.language;
          document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
          state.t = translations[state.language];
        }
      }
    }
  )
);
