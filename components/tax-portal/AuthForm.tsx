"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { taxButtonClass, taxFieldClass } from "@/components/tax-portal/PortalChrome";

type Mode = "login" | "signup" | "staff";

export function AuthForm({
  slug,
  mode,
}: {
  slug: string;
  mode: Mode;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const endpoint =
    mode === "signup"
      ? `/api/tax-portal/${slug}/signup`
      : mode === "staff"
        ? `/api/tax-portal/${slug}/staff-login`
        : `/api/tax-portal/${slug}/login`;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
        phone: form.get("phone"),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      redirect?: string;
    };
    setPending(false);
    if (!res.ok) {
      setError(
        data.error === "locked"
          ? "Too many attempts. Try again in a few minutes."
          : data.error === "unavailable"
            ? "This document portal is not connected yet. Call the office."
            : data.error === "exists"
              ? "An account with that email already exists for this office."
              : data.error === "invalid"
                ? mode === "signup"
                  ? "Name, a real email, phone, and a password of at least 8 characters are required."
                  : "That email or password did not match."
                : "That email or password did not match.",
      );
      return;
    }
    router.push(data.redirect || `/s/${slug}/portal`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-md gap-4">
      {mode === "signup" ? (
        <>
          <label className="text-sm">
            Name / Nombre
            <input name="name" required maxLength={120} autoComplete="name" className={taxFieldClass} />
          </label>
          <label className="text-sm">
            Phone / Teléfono
            <input name="phone" required maxLength={40} autoComplete="tel" className={taxFieldClass} />
          </label>
        </>
      ) : null}
      <label className="text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className={taxFieldClass}
        />
      </label>
      <label className="text-sm">
        Password / Contraseña
        <input
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : 1}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={taxFieldClass}
        />
      </label>
      <button type="submit" disabled={pending} className={taxButtonClass}>
        {pending
          ? "Please wait…"
          : mode === "signup"
            ? "Create account / Crear cuenta"
            : "Log in / Iniciar sesión"}
      </button>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
