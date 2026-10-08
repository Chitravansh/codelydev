import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your CodelyDev digital products before checkout.",
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <header className="mb-10">
        <span className="pill">Cart</span>
        <h1 className="display mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
          Your cart
        </h1>
      </header>
      <CartView />
    </div>
  );
}
