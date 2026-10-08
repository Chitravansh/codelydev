"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { Product } from "@/lib/products";
import {
  cartAdd,
  cartClear,
  cartRemove,
  cartSetQty,
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart,
  CartLine,
} from "@/lib/cart-store";

export type { CartLine };

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, line) => total + line.qty, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.price * line.qty,
      0
    );

    return {
      lines,
      count,
      subtotal,
      add: (product, qty = 1) => cartAdd(product, qty),
      remove: (slug) => cartRemove(slug),
      setQty: (slug, qty) => cartSetQty(slug, qty),
      clear: () => cartClear(),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
