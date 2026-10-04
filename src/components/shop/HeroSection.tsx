"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useLanguageStore } from "@/store/language";

const HERO_SLIDES = [
  {
    tag: "NOUVELLE COLLECTION",
    title: "Beauté & Élégance",
    subtitle: "au quotidien",
    desc: "Découvrez notre sélection de cosmétiques et d'accessoires soigneusement choisis pour sublimer votre beauté.",
    cta: "Découvrir maintenant",
    link: "/products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85",
  },
  {
    tag: "PARFUMS D'EXCEPTION",
    title: "Sillage & Prestige",
    subtitle: "oriental & floral",
    desc: "Laissez-vous envoûter par des fragrances authentiques et envoûtantes à prix doux.",
    cta: "Explorer les parfums",
    link: "/products?category=parfums",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=85",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguageStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = currentSlide === 0
    ? { ...t.hero, link: HERO_SLIDES[0].link, image: HERO_SLIDES[0].image }
    : {
        ...t.hero.featured,
        link: HERO_SLIDES[1].link,
        image: HERO_SLIDES[1].image,
      };

  return (
    <section className="relative overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] flex items-center">
      
      {/* ============================================================ 
          BACKGROUND IMAGE (PLEIN ÉCRAN)
      ============================================================ */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt="Douaa Shop Collection"
          fill
          priority
          className="object-cover object-center transition-opacity duration-1000"
          sizes="100vw"
          unoptimized
        />
        {/* Overlay dégradé rosé pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDECEF]/95 via-[#FCE4E9]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDECEF]/40 via-transparent to-transparent" />
      </div>

      {/* ============================================================ 
          CONTENU (TEXTE + BOUTONS)
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Colonne Texte - Alignée à gauche */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
        

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5C1429] font-normal leading-[1.15] tracking-tight">
              {slide.title}{" "}
              <span className="italic font-serif block text-[#841C3B] mt-1">
                {slide.subtitle}
              </span>
            </h1>

         

            {/* Button */}
            <div className="pt-2 flex justify-center lg:justify-start">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#5C1429] hover:bg-[#480F20] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:gap-3.5 transition-all duration-300"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-4">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? "w-7 bg-[#5C1429]" : "w-2 bg-[#E5BAC4] hover:bg-[#5C1429]/50"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Colonne vide pour laisser l'image visible à droite sur Desktop */}
          <div className="lg:col-span-5 hidden lg:block"></div>
        </div>
      </div>

      {/* ============================================================ 
          FLÈCHES DE NAVIGATION (STYLE MAQUETTE)
      ============================================================ */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-20 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

    </section>
  );
}