import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { HeroSection } from "@/components/shop/HeroSection";
import { CategoryList } from "@/components/shop/CategoryList";
import { TrustFeatures } from "@/components/shop/TrustFeatures";
import { ProductCard } from "@/components/shop/ProductCard";
import { PromoBanners } from "@/components/shop/PromoBanners";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { getCategories, getProducts } from "@/lib/data-service";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts({ limit: 8 });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Announcement Bar */}
      <TopBanner />

      {/* 2. Main Navigation Header */}
      <Header />

      <main className="flex-1">
        {/* 3. Hero Carousel */}
        <HeroSection />

        {/* 4. Categories Section */}
        <CategoryList categories={categories} />

        {/* 5. Trust Badges */}
        <TrustFeatures />

        {/* 6. Popular Products Section (Produits populaires) */}
        <section className="py-14 bg-[#FCF8F9]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#F5D5DC]">
              <div className="flex items-center gap-4">
                <h2 className="font-serif italic text-2xl sm:text-3xl text-[#5C1429] font-normal">
                  Produits populaires
                </h2>
                <div className="hidden sm:block h-px w-20 bg-[#F2C2CD]" />
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C1429] hover:text-[#7A1F39] transition-colors"
              >
                <span>Voir tous les produits</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. Promotional Staged Banners */}
        <PromoBanners />
      </main>

      {/* 8. Luxury Footer */}
      <Footer />

      {/* 9. Sliding Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
