import { notFound } from "next/navigation";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/data-service";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductInformation } from "@/components/shop/ProductInformation";
import { ProductBreadcrumb } from "@/components/shop/ProductBreadcrumb";
import { RelatedProductsHeading } from "@/components/shop/RelatedProductsHeading";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    categoryId: product.category_id,
    limit: 4,
  });

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBanner />
      <Header />

      <main className="flex-1 py-8 bg-[#FCF8F9]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ProductBreadcrumb product={product} />

          {/* Product Hero Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-[#F5D5DC] shadow-xs">
            {/* Left: Product Images */}
            <ProductGallery product={product} />

            <ProductInformation product={product} />
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && (
            <div className="mt-16">
              <RelatedProductsHeading />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
