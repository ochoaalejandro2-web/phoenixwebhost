"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  taxButtonClass,
  taxFieldClass,
} from "@/components/tax-portal/PortalChrome";
import { withSiteLangPath } from "@/lib/site-locale";
import { portalPath } from "@/lib/tax-office";
import { tTaxOffice } from "@/lib/tax-office-i18n";
import { STAFF_RESET_MIN_PASSWORD } from "@/lib/tax-staff-reset";
import type { Locale } from "@/lib/types";

export function StaffForgotForm({
  slug,
  locale,
  defaultEmail = "",
}: {
  slug: string;
  locale: Locale;
  defaultEmail?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const c = tTaxOffice(locale);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch(`/api/tax-portal/${slug}/staff-forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        locale,
        origin: window.location.origin,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(
        data.error === "unavailable"
          ? c.auth.unavailable
          : data.error === "mail"
            ? c.forgotMailDown
            : c.auth.unavailable,
      );
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p role="status" className="mt-8 max-w-md text-sm text-black/80">
        {c.forgotSent}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-md gap-4">
      <label className="text-sm">
        {c.auth.email}
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={defaultEmail}
          className={taxFieldClass}
        />
      </label>
      <button type="submit" disabled={pending} className={taxButtonClass}>
        {pending ? c.auth.wait : c.forgotSubmit}
      </button>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function StaffResetForm({
  slug,
  locale,
  token,
}: {
  slug: string;
  locale: Locale;
  token: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const c = tTaxOffice(locale);
  const a = c.auth;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setPending(false);
      setError(a.resetMismatch);
      return;
    }
    if (password.length < STAFF_RESET_MIN_PASSWORD) {
      setPending(false);
      setError(a.resetWeak);
      return;
    }
    const res = await fetch(`/api/tax-portal/${slug}/staff-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      redirect?: string;
    };
    setPending(false);
    if (!res.ok) {
      setError(
        data.error === "unavailable"
          ? a.unavailable
          : data.error === "weak"
            ? a.resetWeak
            : c.resetInvalid,
      );
      return;
    }
    router.push(
      withSiteLangPath(
        data.redirect || `${portalPath(slug, "/staff/login")}?reset=1`,
        locale,
      ),
    );
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-md gap-4">
      <label className="text-sm">
        {a.newPassword}
        <input
          name="password"
          type="password"
          required
          minLength={STAFF_RESET_MIN_PASSWORD}
          autoComplete="new-password"
          className={taxFieldClass}
        />
      </label>
      <label className="text-sm">
        {a.confirmPassword}
        <input
          name="confirm"
          type="password"
          required
          minLength={STAFF_RESET_MIN_PASSWORD}
          autoComplete="new-password"
          className={taxFieldClass}
        />
      </label>
      <button type="submit" disabled={pending} className={taxButtonClass}>
        {pending ? a.wait : c.resetSubmit}
      </button>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
      <p className="text-sm">
        <Link
          href={withSiteLangPath(portalPath(slug, "/staff/forgot"), locale)}
          className="hover:text-black"
        >
          {c.auth.forgotPassword}
        </Link>
      </p>
    </form>
  );
}
