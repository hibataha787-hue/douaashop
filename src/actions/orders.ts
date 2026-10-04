"use server";

import { z } from "zod";
import { getDeliveryPriceByWilaya, getProductById } from "@/lib/data-service";
import { OrderSummary } from "@/types";

const OrderSchema = z.object({
  customerName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  customerPhone: z.string().min(9, "Numéro de téléphone invalide"),
  wilayaCode: z.number().min(1).max(58, "Code wilaya invalide"),
  address: z.string().min(4, "Adresse trop courte"),
  deliveryType: z.enum(["home", "stopdesk"]).default("home"),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Panier vide"),
});

export type CreateOrderInput = z.infer<typeof OrderSchema>;

export async function createOrderAction(formData: CreateOrderInput) {
  try {
    const validated = OrderSchema.parse(formData);

    // 1. Vérifier les produits et calculer le sous-total côté serveur
    let subtotal = 0;
    const itemsList: OrderSummary["items"] = [];

    for (const item of validated.items) {
      const product = await getProductById(item.productId);
      if (!product || !product.active) {
        throw new Error(`Un produit sélectionné n'est plus disponible.`);
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      itemsList.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price, // prix figé au moment de la commande
        quantity: item.quantity,
        totalPrice: itemTotal,
        image: product.image,
      });
    }

    // 2. Récupérer le tarif de livraison de la wilaya
    const wilayaData = await getDeliveryPriceByWilaya(validated.wilayaCode);
    if (!wilayaData) throw new Error("Wilaya introuvable.");

    const deliveryCost =
      validated.deliveryType === "stopdesk" && wilayaData.stopdesk_price
        ? wilayaData.stopdesk_price
        : wilayaData.home_price;

    const total = subtotal + deliveryCost;

    // 3. Générer un numéro de commande unique (local, pas stocké)
    const orderNumber = `DOUAA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderSummary: OrderSummary = {
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
      notes: validated.notes || "",
      items: itemsList,
    };

    // 4. Générer le message Instagram pré-formaté
    const itemsText = itemsList
      .map((it) => `• ${it.productName} x${it.quantity} → ${it.productPrice.toLocaleString("fr-DZ")} DA`)
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

    // 5. Construire le lien direct Instagram DM avec le message pré-rempli
    // Instagram direct ne supporte pas le texte pré-rempli via URL,
    // donc on copie le message dans le clipboard côté client via sessionStorage
    const instagramUrl = `https://www.instagram.com/douaa_shop.0?stkn=ZnZnMW5yc2hzZzV6`;

    return {
      success: true,
      order: orderSummary,
      instagramMessage,
      instagramUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Une erreur est survenue.",
    };
  }
}
