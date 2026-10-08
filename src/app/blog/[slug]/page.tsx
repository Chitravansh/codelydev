import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { CoverArt } from "@/components/CoverArt";
import { AddToCartButton } from "@/components/AddToCartButton";
import {
  formatDate,
  getAllPosts,
  getPost,
  getRelatedPosts,
} from "@/lib/posts";
import { getFeaturedProducts } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
      images: previousImages,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, 2);
  const upsell = getFeaturedProducts(1)[0];

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/blog" className="transition-colors hover:text-brand">
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{post.tags[0]}</span>
      </nav>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="pill"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h1 className="display mt-5 text-3xl font-semibold leading-[1.15] text-foreground sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4 text-sm text-muted">
          <span className="font-medium text-foreground">{post.author}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      <CoverArt
        cover={post.cover}
        image={post.coverImage}
        eyebrow={post.tags[0]}
        className="mt-8 aspect-[16/8] border border-border"
      />

      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <footer className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
          Written by
        </p>
        <p className="display mt-2 text-lg font-semibold text-foreground">
          {post.author}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          We build and ship production software, then write down what actually
          worked.
        </p>
      </footer>

      {upsell ? (
        <aside className="mt-8 overflow-hidden rounded-2xl border border-border bg-navy">
          <div className="relative p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(30rem 16rem at 100% 0%, rgba(12,192,223,0.32), transparent 60%)",
              }}
            />
            <div className="relative">
              <span className="pill">Go deeper</span>
              <h2 className="display mt-4 text-2xl font-semibold text-white">
                {upsell.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">
                {upsell.tagline}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <AddToCartButton product={upsell} />
                <Link
                  href={`/shop/${upsell.slug}`}
                  className="btn-ghost !border-white/25 !text-white"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        </aside>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="display text-2xl font-semibold text-foreground">
            Keep reading
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
