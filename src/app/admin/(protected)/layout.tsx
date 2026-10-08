import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Wordmark } from "@/components/Brand";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="display text-2xl font-semibold text-foreground">
          No admin access
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          The account {user.email} is signed in, but it is not registered as
          an admin of this site.
        </p>
        <form action={signOut} className="mt-7">
          <button type="submit" className="btn-ghost">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" aria-label="Admin dashboard">
              <Wordmark mark className="h-6 sm:h-7" />
            </Link>
            <span className="pill">Admin</span>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/admin" className="btn-ghost !px-4 !py-2 !text-sm">
              Dashboard
            </Link>
            <Link
              href="/admin/posts/new"
              className="btn-primary !px-4 !py-2 !text-sm"
            >
              New post
            </Link>
            <Link href="/admin/media" className="btn-ghost !px-4 !py-2 !text-sm">
              Media
            </Link>
            <Link href="/" className="btn-ghost !px-4 !py-2 !text-sm">
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="btn-ghost !px-4 !py-2 !text-sm"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
