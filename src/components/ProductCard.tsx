import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";
import { CoverArt } from "./CoverArt";
import { AddToCartButton } from "./AddToCartButton";

const typeLabel: Record<Product["type"], string> = {
  ebook: "eBook",
  pdf: "PDF",
  bundle: "Bundle",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card card-hover flex h-full flex-col overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="block">
        <CoverArt
          cover={product.cover}
          label={product.title}
          eyebrow={typeLabel[product.type]}
          className="aspect-[16/10] rounded-none border-b border-border"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          <span>{product.pages} pages</span>
          <span aria-hidden="true">·</span>
          <span>{product.formats.join(" · ")}</span>
        </div>

        <h3 className="display mt-3 text-xl font-semibold leading-snug">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors hover:text-brand"
          >
            {product.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {product.tagline}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-baseline gap-2">
            <span className="display text-2xl font-semibold text-brand">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAt ? (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAt, product.currency)}
              </span>
            ) : null}
          </div>
          <AddToCartButton product={product} variant="ghost" />
        </div>
      </div>
    </article>
  );
}
