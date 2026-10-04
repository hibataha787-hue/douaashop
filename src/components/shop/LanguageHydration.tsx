"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/store/language";

export function LanguageHydration() {
  useEffect(() => {
    void useLanguageStore.persist.rehydrate();
  }, []);

  return null;
}
