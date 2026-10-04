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
import { PopularProductsHeader } from "@/components/shop/PopularProductsHeader";

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
            <PopularProductsHeader />

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
