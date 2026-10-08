import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { LogoMark } from "@/components/Brand";
import { getFeaturedPosts } from "@/lib/posts";
import { getFeaturedProducts } from "@/lib/products";
import { site } from "@/lib/site";

const stats = [
  { value: "120+", label: "Articles published" },
  { value: "6", label: "Digital resources" },
  { value: "18k", label: "Developers subscribed" },
];

const features = [
  {
    title: "Writing that respects your time",
    body: "Long-form engineering essays with working code, real trade-offs and no filler paragraphs.",
    icon: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z",
  },
  {
    title: "Resources you can download today",
    body: "eBooks, checklists and cheatsheets as PDF and EPUB — instant delivery the second you pay.",
    icon: "M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2",
  },
  {
    title: "Built by developers, for developers",
    body: "Everything here comes from shipping production software — patterns that survived contact with real users.",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

export default async function HomePage() {
  const posts = await getFeaturedPosts(3);
  const featured = getFeaturedProducts(3);

  return (
    <>
      {/* Hero ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(60rem 30rem at 75% -10%, var(--brand-glow), transparent 60%), radial-gradient(40rem 24rem at 5% 20%, color-mix(in srgb, var(--teal) 22%, transparent), transparent 65%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="pill">
                <span className="h-1.5 w-1.5 rounded-full brand-gradient" />
                New posts every week
              </span>

              <h1 className="display mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Code.
                <br />
                Learn.
                <br />
                <span className="gradient-text">Build.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {site.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/blog" className="btn-primary">
                  Read the blog
                </Link>
                <Link href="/shop" className="btn-ghost">
                  Browse the shop
                </Link>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="display text-2xl font-semibold text-foreground sm:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs leading-snug text-muted">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Code card */}
            <div className="card overflow-hidden !rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-muted">
                  useCodelyDev.ts
                </span>
              </div>
              <pre className="overflow-x-auto bg-navy p-5 font-mono text-[0.8rem] leading-relaxed text-[#cfe3f5] sm:text-sm">
                <code>
                  {`import { read, build } from "codelydev";

const weekly = await read({
  topics: ["react", "next.js", "perf"],
  format: "practical",
});

export async function levelUp() {
  await build({ ship: true, measure: true });
  return "better software, faster";
}`}
                </code>
              </pre>
              <div className="flex items-center gap-3 border-t border-border px-5 py-4">
                <LogoMark className="h-7 w-7" />
                <p className="text-sm text-muted">
                  Everything we publish, in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features ------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient">
                <svg
                  className="h-5 w-5 text-navy"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="display mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest articles ------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <SectionHeading
          eyebrow="From the blog"
          title="Latest engineering writing"
          description="Deep dives, patterns and post-mortems from people who ship."
          action={
            <Link href="/blog" className="btn-ghost">
              All articles →
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Shop ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <SectionHeading
          eyebrow="The shop"
          title="eBooks and PDFs worth paying for"
          description="Instant download, lifetime updates, no subscription. Buy once, keep it forever."
          action={
            <Link href="/shop" className="btn-ghost">
              View all products →
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter ----------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 pb-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-navy px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(40rem 20rem at 90% 0%, rgba(12,192,223,0.35), transparent 60%)",
            }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="pill">Newsletter</span>
              <h2 className="display mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                One email a week.
                <br />
                <span className="gradient-text">Zero fluff.</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                New articles, new resources and the occasional teardown of how a
                real product is built. Unsubscribe in one click.
              </p>
            </div>
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
