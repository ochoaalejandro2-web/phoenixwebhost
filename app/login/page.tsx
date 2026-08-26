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
    <div className="flex min-h-full flex-col items-center justify-center bg-sand px-5 py-16">
      <Logo />
      <form
        onSubmit={onSubmit}
        className="mt-8 w-full max-w-sm rounded-2xl border border-line bg-paper p-6"
      >
        <h1 className="font-display text-2xl">Owner login</h1>
        <p className="mt-1 text-sm text-ink-soft">Alex Ochoa · Phoenixwebhost Inc.</p>
        <label className="mt-6 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            defaultValue="alex@phoenixwebhost.com"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-sage py-2.5 text-sm font-semibold text-white"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="mt-3 text-sm text-clay-dark">{error}</p>}
      </form>
    </div>
  );
}
