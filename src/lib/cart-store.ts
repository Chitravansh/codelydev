import { Product } from "@/lib/products";

export interface CartLine {
  slug: string;
  title: string;
  price: number;
  type: Product["type"];
  cover: Product["cover"];
  formats: string[];
  qty: number;
}

const STORAGE_KEY = "codelydev-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) lines = parsed;
  } catch {
    /* ignore corrupt cart */
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartLine[] {
  return lines;
}

export function getCartServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function cartAdd(product: Product, qty = 1) {
  const existing = lines.find((line) => line.slug === product.slug);

  lines = existing
    ? lines.map((line) =>
        line.slug === product.slug ? { ...line, qty: line.qty + qty } : line
      )
    : [
        ...lines,
        {
          slug: product.slug,
          title: product.title,
          price: product.price,
          type: product.type,
          cover: product.cover,
          formats: product.formats,
          qty,
        },
      ];

  persist();
  emit();
}

export function cartRemove(slug: string) {
  lines = lines.filter((line) => line.slug !== slug);
  persist();
  emit();
}

export function cartSetQty(slug: string, qty: number) {
  if (qty <= 0) {
    cartRemove(slug);
    return;
  }
  lines = lines.map((line) =>
    line.slug === slug ? { ...line, qty: Math.min(qty, 99) } : line
  );
  persist();
  emit();
}

export function cartClear() {
  lines = EMPTY;
  persist();
  emit();
}
