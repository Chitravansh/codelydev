"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/products";
import { saveOrder, Order } from "@/lib/orders";

const methods = [
  { value: "card", label: "Credit / debit card", hint: "Visa, Mastercard, Amex" },
  { value: "paypal", label: "PayPal", hint: "Pay with your PayPal balance" },
  { value: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm" },
] as const;

export function CheckoutForm() {
  const { lines, subtotal, count, clear } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState<(typeof methods)[number]["value"]>("card");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          paymentMethod: method,
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      saveOrder(data.order as Order);
      clear();
      router.push(`/order/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center">
        <h2 className="display text-2xl font-semibold text-foreground">
          Nothing to check out
        </h2>
        <p className="mt-2 text-sm text-muted">
          Add a resource to your cart first.
        </p>
        <Link href="/shop" className="btn-primary mt-6">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <section className="card p-6">
          <h2 className="display text-lg font-semibold text-foreground">
            1. Your details
          </h2>
          <p className="mt-1 text-sm text-muted">
            We deliver the download links here — no account required.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="checkout-name">
                Name <span className="normal-case opacity-60">(optional)</span>
              </label>
              <input
                id="checkout-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="label" htmlFor="checkout-email">
                Email address
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="display text-lg font-semibold text-foreground">
            2. Payment method
          </h2>

          <div className="mt-5 grid gap-3">
            {methods.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                  method === option.value
                    ? "border-brand bg-brand-soft"
                    : "border-border hover:border-brand/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={method === option.value}
                  onChange={() => setMethod(option.value)}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-xs leading-relaxed text-muted">
            Demo mode: no live payment gateway is connected yet. The order and
            download flow runs end to end so you can test the full experience —
            wire up Stripe, Paddle or Razorpay in{" "}
            <code className="text-brand">src/app/api/checkout/route.ts</code>.
          </p>
        </section>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
          >
            {error}
          </p>
        ) : null}
      </div>

      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="display text-lg font-semibold text-foreground">
          Order summary
        </h2>

        <ul className="mt-5 space-y-3">
          {lines.map((line) => (
            <li key={line.slug} className="flex justify-between gap-4 text-sm">
              <span className="text-muted">
                {line.title}
                {line.qty > 1 ? (
                  <span className="text-muted"> × {line.qty}</span>
                ) : null}
              </span>
              <span className="shrink-0 font-medium text-foreground">
                {formatPrice(line.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Items ({count})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Delivery</span>
            <span className="text-brand">Instant</span>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <span className="font-semibold text-foreground">Total</span>
            <span className="display text-2xl font-semibold text-brand">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-6 w-full"
        >
          {submitting ? "Processing…" : `Pay ${formatPrice(subtotal)}`}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          By completing this purchase you agree to our terms. Digital goods are
          delivered immediately and are covered by a 30-day refund policy.
        </p>
      </aside>
    </form>
  );
}
