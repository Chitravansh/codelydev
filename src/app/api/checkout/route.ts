import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { makeOrderId, Order, OrderItem } from "@/lib/orders";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface CheckoutPayload {
  email?: string;
  name?: string;
  paymentMethod?: "card" | "paypal" | "upi";
  items?: { slug?: string; qty?: number }[];
}

export async function POST(request: Request) {
  let payload: CheckoutPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = (payload.email ?? "").trim();
  const name = (payload.name ?? "").trim();
  const paymentMethod = payload.paymentMethod ?? "card";
  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required to deliver your files." },
      { status: 400 }
    );
  }

  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Prices and file paths are always resolved server-side so the client can
  // never dictate what it pays or where the download points.
  const items: OrderItem[] = [];
  for (const entry of rawItems) {
    const qty = Math.max(1, Math.min(10, Number(entry.qty) || 1));
    const product = entry.slug ? getProduct(entry.slug) : undefined;

    if (!product) {
      return NextResponse.json(
        { error: `Unknown product in cart: ${entry.slug ?? "missing"}` },
        { status: 400 }
      );
    }

    items.push({
      slug: product.slug,
      title: product.title,
      price: product.price,
      type: product.type,
      file: product.file,
      formats: product.formats,
      qty,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order: Order = {
    id: makeOrderId(),
    email,
    name,
    createdAt: new Date().toISOString(),
    items,
    subtotal,
    total: subtotal,
    currency: "USD",
    paymentMethod,
    status: "paid",
  };

  // Payment integration point — confirm the charge with your provider before
  // returning the order:
  //
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  //   const intent = await stripe.paymentIntents.create({ amount: subtotal * 100, ... })
  //   if (intent.status !== "succeeded") return NextResponse.json({...}, { status: 402 })
  //
  // Until keys are configured this endpoint settles in demo mode so the full
  // purchase + download flow can be exercised end to end.

  return NextResponse.json({ order });
}
