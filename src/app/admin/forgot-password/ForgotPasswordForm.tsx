"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/admin/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
      setPending(false);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-7 rounded-xl border border-border bg-surface p-5">
        <p className="font-medium text-foreground">Check your inbox.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          If an account exists for {email}, a reset link is on its way. Open
          it in this browser to choose a new password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <label className="label" htmlFor="reset-email">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Sending link…" : "Send reset link"}
      </button>
    </form>
  );
}
