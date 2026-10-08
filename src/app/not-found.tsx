import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-mono text-5xl font-bold text-brand">404</p>
      <h1 className="display mt-4 text-3xl font-semibold text-foreground">
        This route does not exist
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The page you were looking for moved or was never here. Try the blog or
        the shop instead.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/blog" className="btn-ghost">
          Read the blog
        </Link>
      </div>
    </div>
  );
}
