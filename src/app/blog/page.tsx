import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical articles on React, Next.js, TypeScript, performance and the craft of shipping software.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <header className="max-w-3xl">
        <span className="pill">Blog</span>
        <h1 className="display mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          Engineering writing,
          <br />
          <span className="gradient-text">minus the noise.</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {posts.length} articles on building fast, maintainable software — each
          one written to be read once and acted on immediately.
        </p>
      </header>

      <nav
        aria-label="Filter by topic"
        className="mt-8 flex flex-wrap gap-2 border-y border-border py-5"
      >
        <span className="mr-1 self-center text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Topics:
        </span>
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="pill transition-transform hover:-translate-y-0.5"
          >
            {tag}
            <span className="opacity-60">{count}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Keep reading"
          title="Get the next article in your inbox"
          description="One email a week with new posts and the resources that accompany them."
        />
        <div className="max-w-xl">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
