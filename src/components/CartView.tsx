"use client";

import Link from "next/link";
import { LogoMark } from "./Brand";
import { useCart } from "./CartProvider";
import { CoverArt } from "./CoverArt";
import { formatPrice } from "@/lib/products";

const typeLabel = { ebook: "eBook", pdf: "PDF", bundle: "Bundle" } as const;

export function CartView() {
  const { lines, subtotal, count, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft p-3"
        >
          <LogoMark className="h-full w-full" />
        </div>
        <h2 className="display mt-6 text-2xl font-semibold text-foreground">
          Your cart is empty
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Grab an eBook, a printable checklist or the full bundle — every
          purchase includes lifetime updates.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Browse the shop
          </Link>
          <Link href="/blog" className="btn-ghost">
            Read the blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.slug}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5"
            >
              <Link
                href={`/shop/${line.slug}`}
                className="w-full shrink-0 sm:w-40"
              >
                <CoverArt
                  cover={line.cover}
                  eyebrow={typeLabel[line.type]}
                  className="aspect-[16/9] border border-border"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/shop/${line.slug}`}
                  className="display text-base font-semibold leading-snug text-foreground transition-colors hover:text-brand"
                >
                  {line.title}
                </Link>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {typeLabel[line.type]} · {line.formats.join(" / ")}
                </p>
                <p className="mt-2 text-sm font-semibold text-brand">
                  {formatPrice(line.price)} each
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1 rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-brand"
                    aria-label={`Decrease quantity of ${line.title}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-brand"
                    aria-label={`Increase quantity of ${line.title}`}
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="display min-w-[4.5rem] text-right text-lg font-semibold text-foreground">
                    {formatPrice(line.price * line.qty)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(line.slug)}
                    className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <Link href="/shop" className="text-sm text-muted hover:text-brand">
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-red-500"
          >
            Empty cart
          </button>
        </div>
      </div>

      <aside className="card h-fit p-6 lg:sticky lg:top-24">
        <h2 className="display text-lg font-semibold text-foreground">
          Order summary
        </h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Items ({count})</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd className="text-brand">Instant download</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Taxes</dt>
            <dd>Calculated at payment</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <dt className="text-sm font-semibold text-foreground">Total</dt>
            <dd className="display text-2xl font-semibold text-brand">
              {formatPrice(subtotal)}
            </dd>
          </div>
        </dl>

        <Link href="/checkout" className="btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Secure checkout. Your files appear on screen the moment payment
          confirms, and are emailed to you as a backup.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Card", "PayPal", "UPI"].map((method) => (
            <span
              key={method}
              className="rounded-md border border-border px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted"
            >
              {method}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
