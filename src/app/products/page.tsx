import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategories, getProducts } from "@/lib/data-service";
import { CatalogHeader } from "@/components/shop/CatalogHeader";
import { CatalogCategoryFilters } from "@/components/shop/CatalogCategoryFilters";
import { CatalogEmptyState } from "@/components/shop/CatalogEmptyState";

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
    tag: tag === "promotions" || tag === "nouveautes" ? tag : undefined,
  });

  const selectedCategory = categories.find((c) => c.slug === category);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-8 bg-[#FCF8F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CatalogHeader
            category={selectedCategory}
            search={search}
            tag={tag}
            count={products.length}
          />

          {/* Category Filter Pills */}
          <CatalogCategoryFilters
            categories={categories}
            selectedCategory={category}
            search={search}
            tag={tag}
          />

          {/* Products Grid */}
          {products.length === 0 ? (
            <CatalogEmptyState />
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
