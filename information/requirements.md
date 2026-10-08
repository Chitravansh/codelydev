# CodelyDev — Requirements & Future Integrations

What is needed to take the site from "demo that works" to a properly functioning
production product. Ordered by priority. Every item names where it plugs in.

Status legend: ☐ todo · ◐ partially done · ☑ done

---

## 1. Payments (P0 — required to actually sell)

- ☐ **Live Stripe integration**
  - `src/app/api/checkout/route.ts` already resolves prices server-side and
    contains a marked demo branch — replace it with a real
    `stripe.paymentIntents.create()` / Checkout Session.
  - Env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
  - Verify webhook signature; fulfil the order **only** from the webhook
    (`checkout.session.completed`), never from the client round-trip.
- ☐ **Payment methods** — the UI already offers Card / PayPal / UPI
  (`CheckoutForm`); enable the ones Stripe actually supports for the target
  market, hide the rest.
- ☐ **Tax** — Stripe Tax (or manual VAT/GST) for digital goods; the checkout
  currently shows "Taxes · Calculated at payment".
- ☐ **Currency strategy** — products carry `currency` per SKU; decide
  multi-currency vs single currency + FX.
- ☐ **Refunds/chargebacks** — UI promises a "30-day refund policy"; needs a
  documented process (Stripe dashboard flow at minimum) and a linked policy page.

## 2. Fulfilment & delivery (P0)

- ☐ **Real product files** — `public/downloads/*.pdf` are placeholders from
  `scripts/make-pdfs.mjs`. Replace with actual eBooks/PDFs; keep filenames in
  `src/lib/products.ts` in sync.
- ☐ **Secure file delivery** — once files are valuable, stop serving them from
  `/downloads` (they are publicly crawlable). Move to S3/R2 with signed,
  expiring URLs issued by the order endpoint.
- ☐ **Receipt / delivery emails** — no email is sent today. Integrate a
  provider (Resend, AWS SES, Postmark):
  - transactional templates: order receipt + download links, newsletter
    confirmation;
  - send from the `/api/checkout` success path and a resend-from-order action.
- ☐ **Licence keys / terms of use** for digital goods if required.

## 3. Accounts & order persistence (P1)

- ☐ **Server-side orders** — orders currently live in `localStorage`
  (`src/lib/orders.ts`); they are device-bound and unrecoverable. Store them in
  a database keyed by order id. *Supabase (Phase 7) already exists — add
  `orders`/`order_items` tables with the same RLS pattern as `posts`.*
- ☐ **Customer accounts** — Supabase Auth is already wired for the admin
  (`/admin/login`); reuse it for customer sign-in and "view my purchases /
  re-download".
- ◐ **Database + ORM** — Supabase Postgres now hosts `posts` (+ `admins`
  membership, RLS). Remaining: `orders`, `order_items`, `customers`,
  `subscriptions`. The app queries Supabase directly (no ORM yet) — add Drizzle
  only if the schema keeps growing.

## 4. Newsletter (P1)

- ☐ `/api/subscribe` is a stub (validates + stores nothing). Integrate a real
  provider (Buttondown, ConvertKit, Mailchimp, Brevo) with:
  - double opt-in, unsubscribe, and a sane rate limit;
  - consent/privacy copy next to the form.

## 5. Legal & compliance (P0 before taking money)

- ☐ **Terms page** — checkout says "you agree to our terms" but no `/terms`
  exists.
- ☐ **Privacy policy** — required for analytics, newsletter and payments.
- ☐ **Refund policy page** — the UI promises a 30-day refund.
- ☐ **Cookie/consent banner** — only if analytics/marketing cookies are added.
- ☐ **Business identity** — company name/address in footer, VAT id if EU.

## 6. SEO, metadata & analytics (P1)

- ☐ **Per-post / per-product OG images** — today everything inherits the single
  `opengraph-image.tsx` (fixed via `parent` metadata inheritance). Dynamic
  `opengraph-image.tsx` under `blog/[slug]` and `shop/[slug]` is the upgrade.
- ☐ **Structured data** — Organization schema exists in `layout.tsx`; add
  `Article` (posts), `Product` + `Offer` (shop), `BreadcrumbList`.
- ☐ **Analytics** — privacy-friendly Plausible or GA4; note consent requirement.
- ☐ **Search Console / Bing Webmaster** verification + submit
  `sitemap.xml` (15 URLs today).
- ☐ **Site search** — Pagefind (static) or Algolia; `/blog` has 5 posts now,
  will need search when content grows.
- ☐ **RSS discovery** — link `<link rel="alternate">` in metadata if not yet
  surfaced in the UI.

## 7. Content workflow (P2)

- ◐ **Authoring pipeline** — done for the base case: an admin can sign in at
  `/admin` and create/edit/publish/delete posts (live markdown preview,
  drafts hidden from the public site, instant revalidation). Still open:
  MDX components in posts, or a headless CMS (Sanity/Tina) if non-technical
  authors join.
- ◐ **Images** — upload/replace/delete is done: admin editor + `/admin/media`
  library store files in IDrive e2 (private bucket, presigned upload,
  `/api/media` redirect for public reads). Still open: `next/image` sizing
  polish for real photography, and moving to a CDN in front of the bucket if
  traffic grows.
- ◐ **Editorial QA** — draft/publish states and publish dates exist in the
  admin editor. Still open: preview mode for unpublished drafts (only admins
  can see them today), redirects for renamed slugs.

## 8. Reliability, security & ops (P1)

- ☐ **CI** — GitHub Actions: `npm run lint`, `npm run build`, plus the E2E
  suite (see §9) on every PR.
- ☐ **Error monitoring** — Sentry (`@sentry/nextjs`) for client + server.
- ☐ **Rate limiting** on `/api/subscribe` and `/api/checkout` (in-memory or
  Upstash) — currently unbounded.
- ☐ **Security headers** — CSP, `X-Content-Type-Options`, referrer policy;
  currently not set.
- ◐ **Env management** — `.env.example` documents the Supabase vars
  (Phase 7); extend it when §1 (Stripe) and §4 (newsletter) land.
- ☐ **Uptime/health check + backups** for the future database.

## 9. Testing (P2)

- ☐ Move the Playwright suites out of the temp folder into the repo
  (`tests/e2e`), pin `@playwright/test` as a devDependency, expose as
  `npm run test:e2e`. Today they live outside the project:
  - `verify.js` — 22 functional checks (theme, blog, cart, checkout, order,
    PDF download, 404, mobile menu, console errors)
  - `verify-logo.js` — 25 brand checks incl. OG pixel sampling
  - `verify-admin.js` — admin flow (unauth redirects + login without
    credentials; publish/draft/edit/delete with `ADMIN_EMAIL`/`ADMIN_PASSWORD`)
  - `verify-media.js` — IDrive e2 pipeline (presign, redirect route, signed
    GET, private-bucket guarantees, key validation, admin gating)
  - route smoke + screenshot scripts
- ☐ Unit tests for pricing/cart math (`src/lib/products.ts`,
  `src/lib/cart-store.ts`) — the server-side price guard is security-relevant.
- ☐ Accessibility audit (axe) + Lighthouse budgets in CI.

## 10. Nice-to-haves (P3)

- ☐ Coupons / launch discounts (needs §1 + §3).
- ☐ Reviews/testimonials on product pages; social proof on the home stats.
- ☐ Bundle discount logic for `fullstack-starter-bundle`.
- ☐ Related-content engine beyond the current tag-based related posts.
- ☐ i18n if the audience expands beyond English.
- ☐ Podcast/newsletter archive section.

---

## Definition of "properly functioning"

The site is production-ready when **§1 (Stripe live), §2 (real files + secure
delivery + receipt email), §5 (legal pages), §8 (CI + rate limits + headers)**
are complete and the E2E suite passes against a real (test-mode) Stripe account.
