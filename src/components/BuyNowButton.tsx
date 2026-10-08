"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { useCart } from "./CartProvider";

export function BuyNowButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        router.push("/checkout");
      }}
      className={`btn-primary ${className}`}
    >
      Buy now
    </button>
  );
}
