import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/posts";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export const metadata: Metadata = { title: "Posts" };

interface AdminPostRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  date: string;
  featured: boolean;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient(await cookies());
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, published, date, featured")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  const posts: AdminPostRow[] = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill">Blog admin</span>
          <h1 className="display mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Posts
          </h1>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          + New post
        </Link>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          Could not load posts: {error.message}
        </p>
      ) : null}

      {!error && posts.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="display text-lg font-semibold text-foreground">
            No posts yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Create the first one — it will show up on /blog as soon as you
            publish it.
          </p>
          <Link href="/admin/posts/new" className="btn-primary mt-6">
            Write the first post
          </Link>
        </div>
      ) : null}

      {posts.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="card flex flex-wrap items-center gap-4 p-5"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="block truncate font-semibold text-foreground transition-colors hover:text-brand"
                >
                  {post.title}
                </Link>
                <p className="mt-1 truncate text-sm text-muted">
                  /blog/{post.slug} · {formatDate(post.date)}
                  {post.featured ? " · Featured" : ""}
                </p>
              </div>

              <span
                className={
                  post.published
                    ? "pill"
                    : "pill !border-border !bg-surface !text-muted"
                }
              >
                {post.published ? "Published" : "Draft"}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="btn-ghost !px-4 !py-2 !text-sm"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
