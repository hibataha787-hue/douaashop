"use client"; 
 
import { useState } from "react"; 
import Image from "next/image"; 
import Link from "next/link"; 
import { useRouter } from "next/navigation"; 
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
} from "lucide-react"; 
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
      router.push( 
        `/products?search=${encodeURIComponent(searchQuery.trim())}` 
      ); 
 
      setMobileMenuOpen(false); 
    } 
  }; 
 
  return ( 
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F7E1E6] shadow-xs"> 
      <div className="max-w-7xl mx-auto px-3 sm:px-6"> 
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4"> 
 
          {/* ============================================================ 
              LOGO IMAGE - STYLE MÉDAILLON (Taille adaptée mobile) 
          ============================================================ */} 
          <Link 
            href="/" 
            className="flex items-center shrink-0 group relative" 
          > 
            {/* Conteneur du logo avec bordure et fond rosé - Padding réduit sur mobile */}
            <div className="relative p-0.5 sm:p-1 rounded-full bg-gradient-to-br from-[#FDF1F3] to-[#F7E1E6] border border-[#F5D0D7] shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image 
                src="/logo.jpeg" 
                alt="Douaa Shop" 
                width={180} 
                height={60} 
                priority 
                className="w-auto h-8 sm:h-12 object-contain rounded-full group-hover:scale-105 transition-transform duration-200" 
              />
            </div>
          </Link> 
 
          {/* ============================================================ 
              DESKTOP NAVIGATION 
          ============================================================ */} 
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2E2E38]"> 
 
            {/* Accueil */} 
            <Link 
              href="/" 
              className="text-[#5C1429] font-semibold border-b-2 border-[#5C1429] pb-0.5 hover:opacity-90 transition-opacity" 
            > 
              {t.nav.home} 
            </Link> 
 
            {/* ======================================================== 
                COSMÉTIQUES 
            ======================================================== */} 
            <div 
              className="relative" 
              onMouseEnter={() => setCosmeticsOpen(true)} 
              onMouseLeave={() => setCosmeticsOpen(false)} 
            > 
              <button 
                type="button" 
                className="flex items-center gap-1 hover:text-[#5C1429] transition-colors py-2 cursor-pointer" 
              > 
                <span>{t.nav.cosmetics}</span> 
 
                <ChevronDown 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${ 
                    cosmeticsOpen ? "rotate-180" : "" 
                  }`} 
                /> 
              </button> 
 
              {cosmeticsOpen && ( 
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-lg border border-[#F5D0D7] py-2 animate-fade-in z-50"> 
 
                  <Link 
                    href="/products?category=parfums" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.perfumes} 
                  </Link> 
 
                  <Link 
                    href="/products?category=soins-visage" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.faceCare} 
                  </Link> 
 
                  <Link 
                    href="/products?category=maquillage" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.makeup} 
                  </Link> 
 
                  <Link 
                    href="/products?category=soins-du-corps" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.bodyCare} 
                  </Link> 
 
                </div> 
              )} 
            </div> 
 
            {/* ======================================================== 
                ACCESSOIRES 
            ======================================================== */} 
            <div 
              className="relative" 
              onMouseEnter={() => setAccessoriesOpen(true)} 
              onMouseLeave={() => setAccessoriesOpen(false)} 
            > 
              <button 
                type="button" 
                className="flex items-center gap-1 hover:text-[#5C1429] transition-colors py-2 cursor-pointer" 
              > 
                <span>{t.nav.accessories}</span> 
 
                <ChevronDown 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${ 
                    accessoriesOpen ? "rotate-180" : "" 
                  }`} 
                /> 
              </button> 
 
              {accessoriesOpen && ( 
                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-lg border border-[#F5D0D7] py-2 animate-fade-in z-50"> 
 
                  <Link 
                    href="/products?category=accessoires" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.bags} 
                  </Link> 
 
                  <Link 
                    href="/products?category=maquillage" 
                    className="block px-4 py-2 hover:bg-[#FDF1F3] text-gray-700 hover:text-[#5C1429] text-xs font-medium" 
                  > 
                    {t.categoriesMenu.brushes} 
                  </Link> 
 
                </div> 
              )} 
            </div> 
 
            {/* Nouveautés */} 
            <Link 
              href="/products?tag=nouveautes" 
              className="hover:text-[#5C1429] transition-colors flex items-center gap-1" 
            > 
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> 
              <span>{t.nav.newArrivals}</span> 
            </Link> 
 
            {/* Promotions */} 
            <Link 
              href="/products?tag=promotions" 
              className="hover:text-[#5C1429] transition-colors text-[#9E2A4B] font-semibold" 
            > 
              {t.nav.promotions} 
            </Link> 
          </nav> 
 
          {/* ============================================================ 
              SEARCH BAR 
          ============================================================ */} 
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
 
          {/* ============================================================ 
              RIGHT ACTIONS 
          ============================================================ */} 
          <div className="flex items-center gap-1 sm:gap-3"> 
 
            {/* Panier */} 
            <button 
              type="button" 
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
 
            {/* Menu mobile */} 
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" 
              aria-label="Menu" 
            > 
              {mobileMenuOpen ? ( 
                <X className="w-6 h-6" /> 
              ) : ( 
                <Menu className="w-6 h-6" /> 
              )} 
            </button> 
 
          </div> 
        </div> 
      </div> 
 
      {/* ================================================================ 
          MOBILE MENU 
      ================================================================ */} 
      {mobileMenuOpen && ( 
        <div className="lg:hidden bg-white border-t border-[#F2D1D8] px-4 pt-3 pb-6 space-y-3 animate-fade-in"> 
 
          {/* Recherche mobile */} 
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
 
            {/* Accueil */} 
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-[#5C1429] font-bold" 
            > 
              {t.nav.home} 
            </Link> 
 
            {/* Parfums */} 
            <Link 
              href="/products?category=parfums" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700" 
            > 
              {t.categoriesMenu.perfumes} 
            </Link> 
 
            {/* Soins visage */} 
            <Link 
              href="/products?category=soins-visage" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700" 
            > 
              {t.categoriesMenu.faceCare} 
            </Link> 
 
            {/* Maquillage */} 
            <Link 
              href="/products?category=maquillage" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700" 
            > 
              {t.categoriesMenu.makeup} 
            </Link> 
 
            {/* Accessoires */} 
            <Link 
              href="/products?category=accessoires" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-gray-700" 
            > 
              {t.nav.accessories} 
            </Link> 
 
            {/* Promotions */} 
            <Link 
              href="/products?tag=promotions" 
              onClick={() => setMobileMenuOpen(false)} 
              className="px-3 py-2 rounded-lg hover:bg-[#FDF1F3] text-[#9E2A4B] font-semibold" 
            > 
              {t.nav.promotions} 
            </Link> 
 
          </div> 
        </div> 
      )} 
    </header> 
  ); 
}