"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatSignCode, signCodeLookupKey } from "@/lib/sign";

export function CodeForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = String(form.get("code") || "");
    const key = signCodeLookupKey(raw);
    if (!key) {
      setError("That code is not valid.");
      return;
    }
    router.push(`/sign/${formatSignCode(key)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full max-w-sm">
      <label className="block text-sm text-body">
        Code
        <input
          name="code"
          required
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="one-time-code"
          placeholder="K7M2-P9QX"
            className="field-studio mt-2 text-center text-base font-display text-2xl tracking-[0.18em]"
        />
      </label>
      <button type="submit" className="btn-lime mt-6 w-full rounded-full py-3 text-base">
        Open document
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-lime-deep">
          {error}
        </p>
      ) : null}
    </form>
  );
}
