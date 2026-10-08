import { Product } from "./products";

export interface OrderItem {
  slug: string;
  title: string;
  price: number;
  type: Product["type"];
  file: string;
  formats: string[];
  qty: number;
}

export interface Order {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  paymentMethod: "card" | "paypal" | "upi";
  status: "paid";
}

const STORAGE_KEY = "codelydev-orders";
const MAX_ORDERS = 20;

let orders: Order[] | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    orders = Array.isArray(parsed) ? parsed : [];
  } catch {
    orders = [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders ?? []));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeOrders(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** `null` means "not read from this device yet" — used as the server snapshot. */
export function getOrdersSnapshot(): Order[] | null {
  return orders;
}

export function getOrdersServerSnapshot(): Order[] | null {
  return null;
}

export function saveOrder(order: Order) {
  orders = [order, ...(orders ?? [])].slice(0, MAX_ORDERS);
  persist();
  emit();
}

export function getOrder(id: string): Order | null {
  return (orders ?? []).find((order) => order.id === id) ?? null;
}

export function makeOrderId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `CD-${Date.now().toString(36).toUpperCase()}${rand.toUpperCase()}`;
}
