"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LogoMark } from "./Brand";
import {
  getOrder,
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeOrders,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";

const typeLabel = { ebook: "eBook", pdf: "PDF", bundle: "Bundle" } as const;

export function OrderDetails({ id }: { id: string }) {
  const orders = useSyncExternalStore(
    subscribeOrders,
    getOrdersSnapshot,
    getOrdersServerSnapshot
  );
  const order = orders === null ? undefined : (getOrder(id) || null);

  if (order === undefined) {
    return (
      <div className="card animate-pulse p-10">
        <div className="h-6 w-1/3 rounded bg-surface-2" />
        <div className="mt-4 h-4 w-1/2 rounded bg-surface-2" />
        <div className="mt-8 h-32 rounded-xl bg-surface-2" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft p-3"
        >
          <LogoMark className="h-full w-full" />
        </div>
        <h1 className="display mt-6 text-2xl font-semibold text-foreground">
          Order not found on this device
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Orders are stored in your browser for this demo. Check the receipt
          email for your download links, or contact us at{" "}
          <a
            href="mailto:hello@codelydev.com"
            className="text-brand underline underline-offset-4"
          >
            hello@codelydev.com
          </a>{" "}
          and we will resend them.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Back to the shop
          </Link>
          <Link href="/blog" className="btn-ghost">
            Read the blog
          </Link>
        </div>
      </div>
    );
  }

  const created = new Date(order.createdAt);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-navy p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(35rem 18rem at 85% -20%, rgba(12,192,223,0.4), transparent 60%)",
          }}
        />
        <div className="relative">
          <span className="pill">Payment confirmed</span>
          <h1 className="display mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Thank you{order.name ? `, ${order.name.split(" ")[0]}` : ""} — your
            files are ready.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            A receipt with these same links has been sent to{" "}
            <span className="text-white">{order.email}</span>. Bookmark this
            page: it is your permanent access link for this device.
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">
                Order
              </dt>
              <dd className="mt-1 font-mono font-semibold text-white">
                {order.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">
                Date
              </dt>
              <dd className="mt-1 font-semibold text-white">
                {created.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">
                Total paid
              </dt>
              <dd className="mt-1 font-semibold text-white">
                {formatPrice(order.total, order.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">
                Method
              </dt>
              <dd className="mt-1 font-semibold uppercase text-white">
                {order.paymentMethod}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-xl font-semibold text-foreground">
            Your downloads
          </h2>
          <span className="text-sm text-muted">
            {order.items.length} item{order.items.length === 1 ? "" : "s"}
          </span>
        </div>

        <ul className="mt-5 space-y-4">
          {order.items.map((item) => (
            <li key={item.slug} className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="pill">{typeLabel[item.type]}</span>
                  <h3 className="display mt-3 text-lg font-semibold text-foreground">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="transition-colors hover:text-brand"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                    {item.formats.join(" · ")}
                    {item.qty > 1 ? ` · ×${item.qty}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <a href={item.file} className="btn-primary" download>
                    Download PDF
                  </a>
                  <span className="text-xs text-muted">
                    {formatPrice(item.price * item.qty, order.currency)} paid
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {item.formats.map((format) => (
                  <a
                    key={format}
                    href={item.file}
                    download
                    className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    {format} ↓
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <h2 className="display text-lg font-semibold text-foreground">
            Want more?
          </h2>
          <p className="mt-1 text-sm text-muted">
            New articles land in the blog every week.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="btn-ghost">
            Back to the shop
          </Link>
          <Link href="/blog" className="btn-primary">
            Read the blog
          </Link>
        </div>
      </section>
    </div>
  );
}
