"use client";

import { useState } from "react";

export function Newsletter({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div
        className={`rounded-2xl border border-brand/40 bg-brand-soft ${
          compact ? "px-5 py-4" : "px-6 py-5"
        }`}
      >
        <p className="text-sm font-medium text-foreground">
          You&apos;re on the list.
        </p>
        <p className="mt-1 text-sm text-muted">
          We send one email a week — new articles, no fluff.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-col gap-3 ${
        compact ? "" : "sm:flex-row sm:items-center"
      }`}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="you@company.com"
        className="input flex-1"
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary shrink-0"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-red-500">
          Could not subscribe — please try again.
        </p>
      ) : null}
    </form>
  );
}
