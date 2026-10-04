"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  getDeliveryPriceByWilaya,
  getProductById,
} from "@/lib/data-service";
import { OrderPriceUpdate, OrderSummary } from "@/types";

const OrderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z
    .string()
    .trim()
    .min(9)
    .max(20)
    .refine((phone) =>
      /^(?:0[567]\d{8}|\+213[567]\d{8})$/.test(
        phone.replace(/[\s().-]/g, "")
      )
    , "Numéro de téléphone algérien invalide"),
  wilayaCode: z.number().int().min(1).max(58),
  address: z.string().trim().min(4).max(500),
  deliveryType: z.enum(["home", "stopdesk"]).default("home"),
  notes: z.string().trim().max(500).optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(25),
      expectedPrice: z.number().nonnegative().optional(),
    })
  ).min(1, "Panier vide").max(30, "Le panier dépasse le nombre maximal d'articles."),
});

export type CreateOrderInput = z.infer<typeof OrderSchema>;

type CreateOrderResult =
  | {
      success: true;
      order: OrderSummary;
      instagramMessage: string;
      instagramUrl: string;
      priceChanged: false;
      updatedProducts: [];
    }
  | {
      success: false;
      error: string;
      priceChanged: boolean;
      updatedProducts: OrderPriceUpdate[];
    };

export async function createOrderAction(
  formData: CreateOrderInput
): Promise<CreateOrderResult> {
  const parsed = OrderSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Les informations de commande sont invalides.",
      priceChanged: false,
      updatedProducts: [],
    };
  }

  try {
    const validated = parsed.data;
    const aggregatedItems = new Map<
      string,
      { quantity: number; expectedPrice?: number }
    >();

    for (const item of validated.items) {
      const existing = aggregatedItems.get(item.productId);
      const quantity = (existing?.quantity ?? 0) + item.quantity;
      if (quantity > 25) {
        return {
          success: false,
          error: "La quantité maximale par produit est de 25.",
          priceChanged: false,
          updatedProducts: [],
        };
      }
      aggregatedItems.set(item.productId, {
        quantity,
        expectedPrice: item.expectedPrice,
      });
    }

    const products = await Promise.all(
      [...aggregatedItems].map(async ([productId, item]) => {
        const product = await getProductById(productId);
        if (!product || !product.active) {
          throw new Error("Un produit sélectionné n'est plus disponible.");
        }
        if (!product.in_stock) {
          throw new Error(`Le produit « ${product.name} » est en rupture de stock.`);
        }
        return { product, ...item };
      })
    );

    const updatedProducts = products
      .filter(
        ({ product, expectedPrice }) =>
          expectedPrice !== undefined && expectedPrice !== product.price
      )
      .map(({ product }) => ({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        image: product.image,
      }));

    if (updatedProducts.length > 0) {
      return {
        success: false,
        error: "Certains prix ont changé. Le panier a été actualisé : vérifiez le nouveau total puis confirmez à nouveau.",
        priceChanged: true,
        updatedProducts,
      };
    }

    const itemsList: OrderSummary["items"] = products.map(
      ({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity,
        totalPrice: product.price * quantity,
        image: product.image,
      })
    );
    const subtotal = itemsList.reduce((sum, item) => sum + item.totalPrice, 0);

    const wilayaData = await getDeliveryPriceByWilaya(validated.wilayaCode);
    if (!wilayaData) {
      throw new Error("Wilaya introuvable ou indisponible pour la livraison.");
    }

    const deliveryCost =
      validated.deliveryType === "stopdesk" &&
      wilayaData.stopdesk_price != null
        ? Number(wilayaData.stopdesk_price)
        : Number(wilayaData.home_price);
    const total = subtotal + deliveryCost;
    const orderNumber = `DOUAA-${new Date().getFullYear()}-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const order: OrderSummary = {
      orderNumber,
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      wilayaCode: validated.wilayaCode,
      wilayaName: `${wilayaData.wilaya_code} - ${wilayaData.wilaya_name}`,
      address: validated.address,
      deliveryType: validated.deliveryType,
      subtotal,
      deliveryCost,
      total,
      notes: validated.notes ?? "",
      items: itemsList,
    };

    const itemsText = itemsList
      .map(
        (item) =>
          `• ${item.productName} x${item.quantity} → ${item.totalPrice.toLocaleString("fr-DZ")} DA`
      )
      .join("\n");
    const instagramMessage =
      `🌸 Bonjour Douaa Shop 🌸\n` +
      `Je souhaite passer la commande suivante :\n\n` +
      `🔖 Réf : #${orderNumber}\n` +
      `👤 Nom : ${validated.customerName}\n` +
      `📞 Tél : ${validated.customerPhone}\n` +
      `📍 Wilaya : ${wilayaData.wilaya_code} - ${wilayaData.wilaya_name} (${wilayaData.wilaya_name_ar})\n` +
      `🏠 Adresse : ${validated.address}\n` +
      `🚚 Livraison : ${validated.deliveryType === "home" ? "À domicile" : "Stop Desk"}\n\n` +
      `🛍️ Articles :\n${itemsText}\n\n` +
      `💰 Sous-total : ${subtotal.toLocaleString("fr-DZ")} DA\n` +
      `🛵 Livraison : ${deliveryCost.toLocaleString("fr-DZ")} DA\n` +
      `✅ Total à payer : ${total.toLocaleString("fr-DZ")} DA\n\n` +
      (validated.notes ? `📝 Note : ${validated.notes}\n\n` : "") +
      `Merci ! ✨`;

    return {
      success: true,
      order,
      instagramMessage,
      instagramUrl:
        process.env.NEXT_PUBLIC_INSTAGRAM_URL?.startsWith("https://")
          ? process.env.NEXT_PUBLIC_INSTAGRAM_URL
          : "https://www.instagram.com/douaa_shop.0/",
      priceChanged: false,
      updatedProducts: [],
    };
  } catch (error) {
    console.error("Erreur lors de la préparation de la commande :", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue lors de la préparation de la commande.",
      priceChanged: false,
      updatedProducts: [],
    };
  }
}
