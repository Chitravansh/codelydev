"use client";

import { useState } from "react";
import { Product, formatPrice } from "@/lib/products";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  product,
  variant = "primary",
  className = "",
}: {
  product: Product;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const base =
    variant === "primary" ? "btn-primary" : "btn-ghost !rounded-full";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${className}`}
      aria-label={`Add ${product.title} to cart`}
    >
      {added ? (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Added to cart
        </>
      ) : (
        <>
          Add to cart · {formatPrice(product.price, product.currency)}
        </>
      )}
    </button>
  );
}
