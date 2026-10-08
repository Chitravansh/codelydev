import type { Metadata } from "next";
import { LogoMark } from "@/components/Brand";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextUrl =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="card p-8">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="display text-lg font-semibold text-foreground">
              CodelyDev Admin
            </p>
            <p className="text-sm text-muted">Sign in to manage the blog.</p>
          </div>
        </div>
        <LoginForm nextUrl={nextUrl} />
      </div>
    </div>
  );
}
