import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Douaa Shop | Beauté & Élégance au quotidien",
  description: "Boutique en ligne de cosmétiques, parfums d'exception et accessoires en Algérie. Livraison 58 Wilayas et paiement à la livraison.",
  keywords: ["cosmétiques", "parfums algérie", "maquillage", "douaa shop", "livraison 58 wilayas", "yara lattafa"],
  openGraph: {
    title: "Douaa Shop | Beauté & Élégance au quotidien",
    description: "Cosmétiques, parfums et accessoires en Algérie. Paiement à la livraison.",
    url: "https://douaashop.dz",
    siteName: "Douaa Shop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_DZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-white text-[#1E1E24] antialiased">
        {children}
      </body>
    </html>
  );
}
