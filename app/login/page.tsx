"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("That email or password did not match.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="studio grain flex min-h-full flex-col items-center justify-center bg-snow px-5 py-16">
      <Logo />
      <form
        onSubmit={onSubmit}
        className="mt-8 w-full max-w-sm rounded-2xl border border-gold/30 bg-snow p-6 ice-glow"
      >
        <h1 className="font-display text-2xl text-ink-black">Owner login</h1>
        <p className="mt-1 text-sm text-ink-black/60">Alex Ochoa · Phoenixwebhost Inc.</p>
        <label className="mt-6 block text-sm text-ink-black">
          Email
          <input
            name="email"
            type="email"
            required
            defaultValue="alex@phoenixwebhost.com"
            className="field-studio"
          />
        </label>
        <label className="mt-4 block text-sm text-ink-black">
          Password
          <input
            name="password"
            type="password"
            required
            className="field-studio"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="btn-gold mt-6 w-full rounded-full py-2.5 text-sm disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="mt-3 text-sm text-gold-deep">{error}</p>}
      </form>
    </div>
  );
}
