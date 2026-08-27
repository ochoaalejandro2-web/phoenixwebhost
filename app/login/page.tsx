"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "code">("password");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function failMessage(status: number, kind: string | undefined) {
    if (status === 429 || kind === "locked") {
      return "Too many attempts. Try again in a few minutes.";
    }
    if (kind === "expired") {
      return "That code expired. Sign in again.";
    }
    if (step === "code") return "That code did not match.";
    return "That email or password did not match.";
  }

  async function onPassword(event: React.FormEvent<HTMLFormElement>) {
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
    const data = (await res.json().catch(() => ({}))) as {
      needsCode?: boolean;
      error?: string;
    };
    setPending(false);
    if (!res.ok) {
      setError(failMessage(res.status, data.error));
      return;
    }
    setStep("code");
  }

  async function onCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: form.get("code") }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(failMessage(res.status, data.error));
      if (data.error === "expired") setStep("password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="studio flex min-h-full flex-col items-center justify-center bg-snow px-5 py-16">
      <Logo />
      {step === "password" ? (
        <form
          onSubmit={onPassword}
          className="mt-10 w-full max-w-sm rounded-[1.5rem] border border-zinc-200 bg-snow p-8"
        >
          <h1 className="font-display text-2xl text-ink-black">Owner login</h1>
          <p className="mt-1 text-sm text-body">Alex Ochoa · Phoenixwebhost Inc.</p>
          <p className="mt-4 text-sm text-body">
            2-step verification is on. After your password, we email and text a
            6-digit code.
          </p>
          <label className="mt-6 block text-sm text-body">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue="alex@phoenixwebhost.com"
              className="field-studio"
            />
          </label>
          <label className="mt-4 block text-sm text-body">
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
            className="btn-lime mt-6 w-full rounded-full py-2.5 text-sm disabled:opacity-60"
          >
            {pending ? "Checking…" : "Continue"}
          </button>
          {error && <p className="mt-3 text-sm text-lime-deep">{error}</p>}
        </form>
      ) : (
        <form
          onSubmit={onCode}
          className="mt-10 w-full max-w-sm rounded-[1.5rem] border border-zinc-200 bg-snow p-8"
        >
          <h1 className="font-display text-2xl text-ink-black">Enter your code</h1>
          <p className="mt-2 text-sm text-body">
            We sent a 6-digit code to your email and phone. It expires in 10
            minutes.
          </p>
          <label className="mt-6 block text-sm text-body">
            Code
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              className="field-studio tracking-[0.4em]"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn-lime mt-6 w-full rounded-full py-2.5 text-sm disabled:opacity-60"
          >
            {pending ? "Verifying…" : "Verify and sign in"}
          </button>
          <button
            type="button"
            className="mt-4 w-full text-sm text-body hover:text-lime"
            onClick={() => {
              setStep("password");
              setError(null);
            }}
          >
            Back to password
          </button>
          {error && <p className="mt-3 text-sm text-lime-deep">{error}</p>}
        </form>
      )}
    </div>
  );
}
