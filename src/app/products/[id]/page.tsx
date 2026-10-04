import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBanner } from "@/components/shop/TopBanner";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/data-service";
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { ProductDetailActions } from "@/components/shop/ProductDetailActions";
import { formatPrice } from "@/lib/utils";

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
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#5C1429]">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-[#5C1429]">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#5C1429] font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>

          {/* Product Hero Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-[#F5D5DC] shadow-xs">
            {/* Left: Product Images */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF2F4] border border-[#F3CAD4] p-6 flex items-center justify-center">
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#5C1429] shadow-xs">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain object-center"
                />
              </div>

              {/* Additional Thumbnails */}
              {product.additional_images && product.additional_images.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl border-2 border-[#5C1429] p-1 overflow-hidden bg-[#FAF2F4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {product.additional_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-xl border border-gray-200 p-1 overflow-hidden bg-[#FAF2F4] opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`${product.name} preview`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Information & Purchase Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {product.category_name && (
                  <span className="text-xs uppercase tracking-wider font-bold text-[#8C2341]">
                    {product.category_name}
                  </span>
                )}

                <h1 className="font-serif text-3xl sm:text-4xl text-[#5C1429] font-bold">
                  {product.name}
                </h1>

                {/* Rating & Stock status */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center text-amber-500 font-bold">
                    ★ {product.rating || "5.0"}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">
                    {product.reviews_count || 18} avis vérifiés
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    En stock
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && product.old_price > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                  {product.old_price && (
                    <span className="text-xs font-bold text-[#5C1429] bg-[#FDECEF] px-2 py-0.5 rounded-md">
                      Économisez {formatPrice(product.old_price - product.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-700 leading-relaxed pt-2">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Client Component for Quantity & Add to Cart / Buy Now */}
              <ProductDetailActions product={product} />

              {/* Trust Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5C1429]" />
                  <span>Livraison 58 Wilayas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5C1429]" />
                  <span>Paiement à la livraison</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#5C1429]" />
                  <span>100% Authentique</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {filteredRelated.length > 0 && (
            <div className="mt-16">
              <h3 className="font-serif italic text-2xl text-[#5C1429] mb-6">
                Vous aimerez aussi
              </h3>
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
