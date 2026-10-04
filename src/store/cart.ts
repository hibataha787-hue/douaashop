"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, OrderPriceUpdate, Product } from "@/types";

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateProductPrices: (products: OrderPriceUpdate[]) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isDrawerOpen: true };
          } else {
            return {
              items: [...state.items, { product, quantity }],
              isDrawerOpen: true,
            };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      updateProductPrices: (products) => {
        const priceUpdates = new Map(
          products.map((product) => [product.productId, product])
        );
        set((state) => ({
          items: state.items.map((item) => {
            const updated = priceUpdates.get(item.product.id);
            return updated
              ? {
                  ...item,
                  product: {
                    ...item.product,
                    name: updated.productName,
                    price: updated.productPrice,
                    image: updated.image,
                  },
                }
              : item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "douaa-shop-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
