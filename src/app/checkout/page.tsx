import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your CodelyDev purchase and download instantly.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <span className="pill">Secure checkout</span>
        <h1 className="display mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
          Almost yours.
        </h1>
        <p className="mt-3 text-lg text-muted">
          Two fields and a payment method. Your files unlock the moment the
          order completes.
        </p>
      </header>

      <CheckoutForm />
    </div>
  );
}
