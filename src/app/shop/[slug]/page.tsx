import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverArt } from "@/components/CoverArt";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BuyNowButton } from "@/components/BuyNowButton";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts, getProduct, getRelatedProducts, formatPrice } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: product.title,
    description: product.tagline,
    openGraph: {
      type: "website",
      title: product.title,
      description: product.tagline,
      images: previousImages,
    },
    alternates: { canonical: `/shop/${product.slug}` },
  };
}

const typeLabel = { ebook: "eBook", pdf: "PDF", bundle: "Bundle" } as const;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/shop" className="transition-colors hover:text-brand">
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{typeLabel[product.type]}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CoverArt
            cover={product.cover}
            label={product.title}
            eyebrow={typeLabel[product.type]}
            className="aspect-[4/3] border border-border"
          />
          <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-5 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Pages
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {product.pages}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Format
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {product.formats.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Type
              </dt>
              <dd className="mt-1 font-semibold capitalize text-foreground">
                {typeLabel[product.type]}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">
                Updated
              </dt>
              <dd className="mt-1 font-semibold text-foreground">
                {product.updated}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <span className="pill">{typeLabel[product.type]}</span>

          <h1 className="display mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mt-7 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-baseline gap-3">
              <span className="display text-4xl font-semibold text-brand">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAt ? (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.compareAt, product.currency)}
                </span>
              ) : null}
              <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                One-time payment
              </span>
            </div>

            <p className="mt-2 text-sm text-muted">
              Instant download · Lifetime updates · 30-day refund
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} className="flex-1" />
              <BuyNowButton product={product} className="flex-1" />
            </div>

            <Link
              href="/cart"
              className="mt-3 block text-center text-sm text-muted transition-colors hover:text-brand"
            >
              View cart →
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="display text-xl font-semibold text-foreground">
              What&apos;s inside
            </h2>
            <ul className="mt-4 space-y-3">
              {product.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full brand-gradient text-[0.7rem] font-bold text-navy">
                    ✓
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="display text-xl font-semibold text-foreground">
              Also included
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.includes.map((item) => (
                <li key={item} className="pill !normal-case !tracking-normal">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="display text-2xl font-semibold text-foreground">
          You might also like
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
