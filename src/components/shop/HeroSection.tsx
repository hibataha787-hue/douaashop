"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useLanguageStore } from "@/store/language";

const HERO_SLIDES = [
  {
    tag: "NOUVELLE COLLECTION",
    title: "Beauté & Élégance",
    subtitle: "au quotidien",
    desc: "Découvrez notre sélection de cosmétiques et d'accessoires soigneusement choisis pour sublimer votre beauté.",
    cta: "Découvrir maintenant",
    link: "/products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85",
  },
  {
    tag: "PARFUMS D'EXCEPTION",
    title: "Sillage & Prestige",
    subtitle: "oriental & floral",
    desc: "Laissez-vous envoûter par des fragrances authentiques et envoûtantes à prix doux.",
    cta: "Explorer les parfums",
    link: "/products?category=parfums",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
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

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FDECEF] via-[#FCE4E9] to-[#FBE0E7] py-12 md:py-16 lg:py-20 border-b border-[#F7D3DB]">
      {/* Background soft glowing circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-[#F7CAD4]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#F3C4CE] text-[#8C1E3E] text-xs font-semibold tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5C1429] font-normal leading-[1.15] tracking-tight">
              {slide.title}{" "}
              <span className="italic font-serif block text-[#841C3B] mt-1">
                {slide.subtitle}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {slide.desc}
            </p>

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

          {/* Hero Visual Image */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Elegant luxury staging frame */}
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <img
                src={slide.image}
                alt="Douaa Shop Collection"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Left/Right buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
