
"use client";

import Link from "next/link";
import Image from "next/image";
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

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 group relative w-fit"
            >
              <div className="relative p-0.5 sm:p-1 rounded-full bg-gradient-to-br from-[#FDF1F3] to-[#F7E1E6] border border-[#F5D0D7] shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                  src="/logo.jpeg"
                  alt="Douaa Shop"
                  width={180}
                  height={60}
                  priority
                  className="w-auto h-10 sm:h-12 object-contain rounded-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            <p className="text-xs text-[#F2C2CD] leading-relaxed">
              {t.footer.aboutText}
            </p>

            {/* Instagram */}
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
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=parfums"
                  className="hover:text-white transition-colors"
                >
                  Parfums d&apos;exception
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=soins-visage"
                  className="hover:text-white transition-colors"
                >
                  Soins visage & crèmes
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=maquillage"
                  className="hover:text-white transition-colors"
                >
                  Maquillage & Pinceaux
                </Link>
              </li>

              <li>
                <Link
                  href="/products?category=accessoires"
                  className="hover:text-white transition-colors"
                >
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
                <span>
                  Paiement en espèces à la livraison (Main à main)
                </span>
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
              Gérez facilement vos articles, mettez à jour vos prix et
              consultez les commandes reçues.
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
            Fait avec
            <Heart className="w-3 h-3 text-[#E59AB0] fill-current" />
            pour la beauté et l&apos;élégance.
          </p>
        </div>
      </div>
    </footer>
  );

}