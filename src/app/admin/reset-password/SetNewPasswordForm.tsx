"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function SetNewPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }

    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setPending(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.replace("/admin"), 1500);
  }

  if (done) {
    return (
      <div className="mt-7 rounded-xl border border-border bg-surface p-5">
        <p className="font-medium text-foreground">Password updated.</p>
        <p className="mt-1.5 text-sm text-muted">
          Taking you to the admin area…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <label className="label" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="label" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="input"
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
