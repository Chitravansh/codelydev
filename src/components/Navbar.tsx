"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Brand";
import { useCart } from "./CartProvider";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="shrink-0 text-[1.15rem] text-foreground"
          aria-label={`${navLinks[0].label} — codelydev`}
        >
          <Wordmark mark className="h-7 sm:h-8" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-brand"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
              {isActive(link.href) ? (
                <span className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full brand-gradient" />
              ) : null}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/cart"
            className="relative flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2 5h13M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full brand-gradient px-1 text-[0.7rem] font-bold text-navy">
                {count}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-soft text-brand"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={close}
              className="rounded-xl px-4 py-3 text-base font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              Cart {count > 0 ? `(${count})` : ""}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
