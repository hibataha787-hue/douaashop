import Link from "next/link";
import { getAllProductsAdmin, getAllCategoriesAdmin, getDeliveryPrices } from "@/lib/data-service";
import {
  Package,
  Truck,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export default async function AdminDashboardPage() {
  const products = await getAllProductsAdmin();
  const categories = await getAllCategoriesAdmin();
  const wilayas = await getDeliveryPrices();

  const activeProducts = products.filter((p) => p.active).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C1429]">
            Tableau de Bord
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Interface d&apos;administration de la boutique Douaa Shop.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C1429] hover:bg-[#480F20] text-white text-xs font-semibold shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Produits Actifs */}
        <div className="p-6 rounded-2xl bg-white border border-[#F5D5DC] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[#5C1429]">
            <span className="text-xs font-semibold text-gray-500">
              Articles actifs en boutique
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-gray-900">
            {activeProducts}
            <span className="text-xs font-normal text-gray-400 ml-2">
              / {products.length} articles
            </span>
          </p>
        </div>

        {/* Card 2: Catégories */}
        <div className="p-6 rounded-2xl bg-white border border-[#F5D5DC] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[#5C1429]">
            <span className="text-xs font-semibold text-gray-500">
              Catégories de produits
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-gray-900">
            {categories.length}
          </p>
        </div>

        {/* Card 3: Wilayas */}
        <div className="p-6 rounded-2xl bg-white border border-[#F5D5DC] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[#5C1429]">
            <span className="text-xs font-semibold text-gray-500">
              Wilayas d&apos;Algérie couvertes
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-gray-900">
            {wilayas.length} Wilayas
          </p>
        </div>
      </div>

      {/* Reception des commandes via Instagram Notice */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FDF1F3] via-white to-[#FCE8EB] border-2 border-[#F6BDC9] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-xs">
            <InstagramIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#5C1429]">
              Réception des Commandes en direct sur Instagram
            </h3>
            <p className="text-xs text-gray-600">
              Aucune commande n&apos;est stockée en base de données. Vos clientes valident leur panier et vous transmettent leur commande pré-formatée directement par message privé (DM).
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="https://www.instagram.com/douaa_shop.0?stkn=ZnZnMW5yc2hzZzV6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D62976] via-[#962FBF] to-[#4F5BD5] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Ouvrir vos messages Instagram (@douaa_shop.0)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-white border border-[#F5D5DC] hover:border-[#5C1429] transition-all group flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#5C1429]">
              Gérer les Produits & les Prix
            </h4>
            <p className="text-xs text-gray-500">
              Ajouter des articles, modifier les prix en direct, masquer ou supprimer des produits.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#5C1429] group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          href="/admin/delivery"
          className="p-6 rounded-2xl bg-white border border-[#F5D5DC] hover:border-[#5C1429] transition-all group flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#5C1429]">
              Tarifs de Livraison (58 Wilayas)
            </h4>
            <p className="text-xs text-gray-500">
              Modifier les tarifs de livraison à domicile et en point relais pour chaque wilaya.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#5C1429] group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
}
