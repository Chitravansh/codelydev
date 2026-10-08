import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { getAllProducts, productTypes, ProductType } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — eBooks, PDFs & bundles",
  description:
    "Buy practical developer resources: eBooks, printable checklists and bundles. Instant download, lifetime updates.",
  alternates: { canonical: "/shop" },
};

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const active = (
    productTypes.some((t) => t.value === type) ? type : "all"
  ) as ProductType | "all";

  const products = getAllProducts().filter(
    (p) => active === "all" || p.type === active
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <header className="max-w-3xl">
        <span className="pill">Shop</span>
        <h1 className="display mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          Resources you can
          <br />
          <span className="gradient-text">download today.</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          eBooks, checklists and cheatsheets written by developers who ship.
          Instant delivery as PDF and EPUB, lifetime updates included.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Filter products"
        className="mt-8 flex flex-wrap gap-2 border-y border-border py-5"
      >
        {productTypes.map((option) => {
          const isActive = option.value === active;
          const href =
            option.value === "all" ? "/shop" : `/shop?type=${option.value}`;
          return (
            <Link
              key={option.value}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "brand-gradient text-navy"
                  : "border border-border text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      <section className="mt-20 grid gap-8 rounded-3xl border border-border bg-surface p-8 sm:p-10 lg:grid-cols-2">
        <div>
          <span className="pill">Buy with confidence</span>
          <h2 className="display mt-4 text-2xl font-semibold text-foreground">
            Instant delivery, lifetime updates
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="text-brand" aria-hidden="true">
                ✓
              </span>
              Files available on the confirmation page the moment you pay.
            </li>
            <li className="flex gap-3">
              <span className="text-brand" aria-hidden="true">
                ✓
              </span>
              A receipt with the same links is emailed to you.
            </li>
            <li className="flex gap-3">
              <span className="text-brand" aria-hidden="true">
                ✓
              </span>
              Free updates whenever the content is revised.
            </li>
            <li className="flex gap-3">
              <span className="text-brand" aria-hidden="true">
                ✓
              </span>
              30-day refund if it is not what you expected.
            </li>
          </ul>
        </div>
        <div className="max-w-md lg:justify-self-end">
          <h3 className="display text-xl font-semibold text-foreground">
            Not sure where to start?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Join the newsletter and we will send you a free chapter plus the
            performance checklist.
          </p>
          <div className="mt-4">
            <Newsletter compact />
          </div>
        </div>
      </section>
    </div>
  );
}
