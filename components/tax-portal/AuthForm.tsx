"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { taxButtonClass, taxFieldClass } from "@/components/tax-portal/PortalChrome";
import { withSiteLangPath } from "@/lib/site-locale";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import type { Locale } from "@/lib/types";

type Mode = "login" | "signup" | "staff";

export function AuthForm({
  slug,
  mode,
  locale,
}: {
  slug: string;
  mode: Mode;
  locale: Locale;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const c = tTaxOffice(locale).auth;

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
          ? c.locked
          : data.error === "unavailable"
            ? c.unavailable
            : data.error === "exists"
              ? c.exists
              : data.error === "invalid"
                ? mode === "signup"
                  ? c.signupInvalid
                  : c.badLogin
                : c.badLogin,
      );
      return;
    }
    router.push(
      withSiteLangPath(data.redirect || `/s/${slug}/portal`, locale),
    );
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-md gap-4">
      {mode === "signup" ? (
        <>
          <label className="text-sm">
            {c.name}
            <input name="name" required maxLength={120} autoComplete="name" className={taxFieldClass} />
          </label>
          <label className="text-sm">
            {c.phone}
            <input name="phone" required maxLength={40} autoComplete="tel" className={taxFieldClass} />
          </label>
        </>
      ) : null}
      <label className="text-sm">
        {c.email}
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
        {c.password}
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
          ? c.wait
          : mode === "signup"
            ? c.create
            : c.login}
      </button>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
