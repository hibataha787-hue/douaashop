"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Layers,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip layout sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Produits & Prix", href: "/admin/products", icon: Package },
    { label: "Catégories", href: "/admin/categories", icon: Layers },
    { label: "Frais de livraison (58 Wilayas)", href: "/admin/delivery", icon: Truck },
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("douaa_admin_logged");
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FBF7F8] flex flex-col md:flex-row">
      {/* Mobile Top bar */}
      <div className="md:hidden bg-white border-b border-[#F5D5DC] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5C1429] text-white flex items-center justify-center font-serif font-bold text-sm">
            D
          </div>
          <span className="font-serif font-bold text-[#5C1429]">Douaa Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile drawer */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white border-r border-[#F5D5DC] flex flex-col justify-between shrink-0 sticky md:h-screen top-0 z-20`}
      >
        <div className="p-6 space-y-8">
          {/* Logo brand */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C1429] to-[#8C2341] flex items-center justify-center text-white shadow-sm">
              <span className="font-serif text-xl font-bold">D</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#5C1429] block leading-none">
                Douaa Shop
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#9E4A62] font-semibold">
                Administration
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#5C1429] text-white shadow-xs"
                      : "text-gray-600 hover:bg-[#FDF1F3] hover:text-[#5C1429]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Direct Instagram link for admin */}
            <a
              href="https://www.instagram.com/douaa_shop.0?stkn=ZnZnMW5yc2hzZzV6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#8C2341] bg-[#FAF0F2] hover:bg-[#F8E4E9] transition-all"
            >
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram Boutique</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>Voir la boutique client</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
