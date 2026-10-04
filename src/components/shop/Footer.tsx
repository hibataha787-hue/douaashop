"use client";

import Link from "next/link";
import { MapPin, ShieldCheck, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useLanguageStore } from "@/store/language";

export function Footer() {
  const { t } = useLanguageStore();

  return (
    <footer className="border-t-4 border-[#5C1429] bg-[#2D0A14] pt-10 pb-8 text-white sm:pt-16 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-b border-[#521C2B] pb-8 sm:gap-10 sm:pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-3 sm:space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C2341] to-[#BA375D] flex items-center justify-center text-white shadow-sm">
                <span className="font-serif text-xl font-bold tracking-tight">D</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wide text-white leading-none">
                  Douaa
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#E59AB0] font-semibold">
                  Shop
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F2C2CD] leading-relaxed">
              {t.footer.aboutText}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/douaa_shop.0?stkn=ZnZnMW5yc2hzZzV6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A1423] hover:bg-[#BA375D] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Suivez Douaa Shop sur Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F8BAC7] tracking-wide">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-[11px] leading-relaxed text-[#F2C2CD] sm:text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products?category=parfums" className="hover:text-white transition-colors">
                  Parfums d&apos;exception
                </Link>
              </li>
              <li>
                <Link href="/products?category=soins-visage" className="hover:text-white transition-colors">
                  Soins visage & crèmes
                </Link>
              </li>
              <li>
                <Link href="/products?category=maquillage" className="hover:text-white transition-colors">
                  Maquillage & Pinceaux
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessoires" className="hover:text-white transition-colors">
                  Sacs & Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service & 58 Wilayas */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#F8BAC7] tracking-wide">
              {t.footer.customerService}
            </h4>
            <ul className="space-y-2.5 text-[11px] leading-relaxed text-[#F2C2CD] sm:text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E59AB0] shrink-0 mt-0.5" />
                <span>{t.footer.allWilayas}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E59AB0] shrink-0 mt-0.5" />
                <span>Paiement en espèces à la livraison (Main à main)</span>
              </li>
              <li className="flex items-start gap-2">
                <InstagramIcon className="w-4 h-4 text-[#E59AB0] shrink-0 mt-0.5" />
                <span>@douaa_shop.0 disponible 7j/7</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Commitment */}
          <div className="col-span-2 space-y-3 md:col-span-1">
            <h4 className="font-serif text-base font-bold text-[#F8BAC7] tracking-wide">
              Espace Administrateur
            </h4>
            <p className="text-xs text-[#F2C2CD]">
              Gérez facilement vos articles, mettez à jour vos prix et consultez les commandes reçues.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-block px-4 py-2 rounded-xl bg-[#4A1423] hover:bg-[#681E32] text-xs font-semibold text-white transition-colors border border-[#7A2A3D]"
              >
                Connexion Administration
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D89CAE] gap-4">
          <p>
            © {new Date().getFullYear()} Douaa Shop. {t.footer.rights}
          </p>
          <p className="flex items-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-[#E59AB0] fill-current" /> pour la beauté et l&apos;élégance.
          </p>
        </div>
      </div>
    </footer>
  );
}
