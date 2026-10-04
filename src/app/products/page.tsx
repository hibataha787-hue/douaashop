import Link from "next/link";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategories, getProducts } from "@/lib/data-service";
import { ChevronRight } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>;
}) {
  const { category, search, tag } = await searchParams;
  const categories = await getCategories();
  const products = await getProducts({
    categorySlug: category,
    search: search,
  });

  const selectedCategory = categories.find((c) => c.slug === category);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-8 bg-[#FCF8F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#5C1429]">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#5C1429] font-medium">Catalogue</span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-semibold">
                  {selectedCategory.name}
                </span>
              </>
            )}
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-serif italic text-3xl sm:text-4xl text-[#5C1429]">
              {selectedCategory
                ? selectedCategory.name
                : search
                ? `Résultats pour "${search}"`
                : tag === "promotions"
                ? "Nos Promotions Exceptionnelles"
                : "Notre Collection Complète"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !category
                  ? "bg-[#5C1429] text-white shadow-xs"
                  : "bg-white border border-[#F5D5DC] text-gray-700 hover:border-[#5C1429]"
              }`}
            >
              Tous les produits
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat.slug
                    ? "bg-[#5C1429] text-white shadow-xs"
                    : "bg-white border border-[#F5D5DC] text-gray-700 hover:border-[#5C1429]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#F5D5DC] p-8">
              <p className="text-gray-500 text-sm">
                Aucun produit ne correspond à votre recherche.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block px-5 py-2.5 rounded-full bg-[#5C1429] text-white text-xs font-semibold"
              >
                Voir tous les produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
