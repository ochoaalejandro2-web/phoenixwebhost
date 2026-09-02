"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={
        className ||
        "rounded-full border border-line px-3 py-1.5 text-sm hover:border-clay/40"
      }
    >
      {copied ? "Copied" : label}
    </button>
  );
}
