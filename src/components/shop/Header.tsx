"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cosmeticsOpen, setCosmeticsOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const openDrawer = useCartStore((state) => state.openDrawer);
  const { t } = useLanguageStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F7E1E6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C1429] to-[#8C2341] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-bold tracking-tight">D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-[#5C1429] leading-none">
                Douaa
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E4A62] font-semibold">
                Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2E2E38]">
            <Link
              href="/"
              className="text-[#5C1429] font-semibold border-b-2 border-[#5C1429] pb-0.5 hover:opacity-90 transition-opacity"
            >
              {t.nav.home}
            </Link>

            {/* Dropdown Cosmétiques */}
            <div
              className="relative"
              onMouseEnter={() => setCosmeticsOpen(true)}
              onMouseLeave={() => setCosmeticsOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#5C1429] transition-colors py-2 cursor-pointer">
                <span>{t.nav.cosmetics}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${cosmeticsOpen ? "rotate-180" : ""}`} />
              </button>
              {cosmeticsOpen && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-lg border border-[#F5D0D7] py-2 animate-fade-in z-50">
                  <Link
                    href="/products?category=parfums"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Parfums & Fragrances
                  </Link>
                  <Link
                    href="/products?category=soins-visage"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Soins du Visage
                  </Link>
                  <Link
                    href="/products?category=maquillage"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Maquillage & Beauté
                  </Link>
                  <Link
                    href="/products?category=soins-du-corps"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Soins du Corps
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Accessoires */}
            <div
              className="relative"
              onMouseEnter={() => setAccessoriesOpen(true)}
              onMouseLeave={() => setAccessoriesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-[#5C1429] transition-colors py-2 cursor-pointer">
                <span>{t.nav.accessories}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accessoriesOpen ? "rotate-180" : ""}`} />
              </button>
              {accessoriesOpen && (
                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-lg border border-[#F5D0D7] py-2 animate-fade-in z-50">
                  <Link
                    href="/products?category=accessoires"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Sacs & Maroquinerie
                  </Link>
                  <Link
                    href="/products?category=maquillage"
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium"
                  >
                    Pinceaux & Trousses
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/products?tag=nouveautes"
              className="hover:text-[#5C1429] transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{t.nav.newArrivals}</span>
            </Link>

            <Link
              href="/products?tag=promotions"
              className="hover:text-[#5C1429] transition-colors text-[#9E2A4B] font-semibold"
            >
              {t.nav.promotions}
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-xs relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF5F6] border border-[#F2D1D8] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#5C1429]/20 focus:border-[#5C1429] transition-all placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Right Actions: Admin & Cart */}
          <div className="flex items-center gap-3">
            {/* Admin icon link */}
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-full hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] transition-colors"
              title={t.nav.admin}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative p-2 rounded-full hover:bg-[#FDF1F3] text-gray-800 hover:text-[#5C1429] transition-colors cursor-pointer"
              title={t.nav.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5C1429] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#F2D1D8] px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF5F6] border border-[#F2D1D8] rounded-full focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-[#5C1429] font-bold"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/products?category=parfums"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700"
            >
              Parfums
            </Link>
            <Link
              href="/products?category=soins-visage"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700"
            >
              Soins Visage
            </Link>
            <Link
              href="/products?category=maquillage"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700"
            >
              Maquillage
            </Link>
            <Link
              href="/products?category=accessoires"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700"
            >
              Accessoires
            </Link>
            <Link
              href="/products?tag=promotions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-[#9E2A4B] font-semibold"
            >
              Promotions
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 mt-2 flex items-center justify-between"
            >
              <span>{t.nav.admin}</span>
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
