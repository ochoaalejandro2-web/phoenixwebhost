"use client";

import { useEffect } from "react";

export const STUDIO_FLARE_KEY = "phx-studio-flare";

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

function flareAlreadySeen() {
  try {
    return sessionStorage.getItem(STUDIO_FLARE_KEY) === "1";
  } catch {
    return true;
  }
}

function markFlareSeen() {
  try {
    sessionStorage.setItem(STUDIO_FLARE_KEY, "1");
  } catch {
    /* private mode */
  }
}

function setFlareState(value: "play" | "skip" | "done") {
  document.documentElement.dataset.studioFlare = value;
}

/**
 * First-visit lime/gold flare on the marketing homepage only.
 * A beforeInteractive boot script in the root layout sets
 * data-studio-flare to play or skip before paint. CSS hides the
 * overlay unless play is set, so it never blocks clicks afterward.
 */
export function StudioFlare() {
  useEffect(() => {
    const html = document.documentElement;
    const state = html.dataset.studioFlare;
    const finish = () => setFlareState("done");

    if (state === "play") {
      markFlareSeen();
      const fallback = window.setTimeout(finish, 1800);
      return () => window.clearTimeout(fallback);
    }

    if (state === "skip" || prefersReducedMotion() || flareAlreadySeen()) {
      setFlareState("skip");
      return;
    }

    setFlareState("play");
    markFlareSeen();
    const fallback = window.setTimeout(finish, 1800);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div
      className="studio-flare"
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        setFlareState("done");
      }}
    >
      <div className="studio-flare-veil" />
      <div className="studio-flare-burst" />
      <div className="studio-flare-ring" />
      <div className="studio-flare-core" />
    </div>
  );
}
