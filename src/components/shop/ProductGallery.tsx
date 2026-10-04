"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const images = [
    product.image,
    ...(product.additional_images ?? []),
  ];

  return (
    <div className="lg:col-span-6 space-y-4">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF2F4] border border-[#F3CAD4] p-6 flex items-center justify-center">
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#5C1429] shadow-xs">
            {product.badge}
          </span>
        )}
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized
          className="object-contain object-center p-6"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={`Afficher l'image ${index + 1} de ${product.name}`}
              aria-pressed={selectedImage === image}
              className={`w-20 h-20 rounded-xl border-2 p-1 overflow-hidden bg-[#FAF2F4] ${
                selectedImage === image
                  ? "border-[#5C1429]"
                  : "border-gray-200 opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name}, image ${index + 1}`}
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
