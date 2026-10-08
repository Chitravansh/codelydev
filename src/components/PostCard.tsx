import Link from "next/link";
import { Post, formatDate } from "@/lib/posts";
import { CoverArt } from "./CoverArt";

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        <CoverArt
          cover={post.cover}
          image={post.coverImage}
          eyebrow={post.tags[0]}
          className={
            featured
              ? "aspect-[16/8] rounded-none border-b border-border"
              : "aspect-[16/9] rounded-none border-b border-border"
          }
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag)}`}
              className="pill hover:brightness-110"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h3
          className={`display mt-4 font-semibold leading-snug text-foreground ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-brand"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
          <span
            aria-hidden="true"
            className="ml-auto font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100"
          >
            Read →
          </span>
        </div>
      </div>
    </article>
  );
}
