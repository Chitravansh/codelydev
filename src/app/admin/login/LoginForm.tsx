"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function LoginForm({ nextUrl }: { nextUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }

    router.replace(nextUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <label className="label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="label" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary flex-1"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <a
          href="/admin/forgot-password"
          className="shrink-0 text-sm text-muted underline underline-offset-4 transition-colors hover:text-brand"
        >
          Forgot password?
        </a>
      </div>
    </form>
  );
}
