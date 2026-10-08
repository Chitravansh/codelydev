import Link from "next/link";
import { Wordmark } from "./Brand";
import { site, navLinks } from "@/lib/site";

const shopLinks = [
  { href: "/shop", label: "All products" },
  { href: "/shop?type=ebook", label: "eBooks" },
  { href: "/shop?type=pdf", label: "PDFs" },
  { href: "/shop?type=bundle", label: "Bundles" },
];

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog/tag/React", label: "React articles" },
  { href: "/blog/tag/Performance", label: "Performance" },
  { href: "/rss.xml", label: "RSS feed" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-3">
              <Wordmark mark className="h-9" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-muted/70">
              {site.tagline}
            </p>
          </div>

          <LinkColumn title="Explore" links={[...navLinks]} />
          <LinkColumn title="Products" links={shopLinks} />
          <LinkColumn title="Resources" links={[...resourceLinks, ...companyLinks]} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={site.social.github}
              className="text-sm text-muted transition-colors hover:text-brand"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href={site.social.x}
              className="text-sm text-muted transition-colors hover:text-brand"
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
            <a
              href={site.social.linkedin}
              className="text-sm text-muted transition-colors hover:text-brand"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-muted transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
