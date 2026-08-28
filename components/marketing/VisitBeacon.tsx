"use client";

import { useEffect } from "react";

let lastSentAt = 0;

export function VisitBeacon() {
  useEffect(() => {
    const now = Date.now();
    if (now - lastSentAt < 1000) return;
    lastSentAt = now;
    try {
      if (navigator.sendBeacon && navigator.sendBeacon("/api/visits")) return;
    } catch {
      /* fall through to fetch */
    }
    void fetch("/api/visits", { method: "POST", keepalive: true });
  }, []);
  return null;
}
