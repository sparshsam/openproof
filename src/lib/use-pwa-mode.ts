"use client";

import { useEffect, useState } from "react";

export type DisplayMode = "standalone" | "fullscreen" | "minimal-ui" | "browser";

export type PwaMode = {
  isPwa: boolean;
  displayMode: DisplayMode;
  isMobile: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
};

function getDisplayMode(): DisplayMode {
  if (typeof window === "undefined") return "browser";

  // iOS standalone mode
  if ((navigator as Navigator & { standalone?: boolean }).standalone) {
    return "standalone";
  }

  // Standard display-mode media query
  const mq = window.matchMedia("(display-mode: standalone)");
  if (mq.matches) return "standalone";
  const fq = window.matchMedia("(display-mode: fullscreen)");
  if (fq.matches) return "fullscreen";
  const mqMin = window.matchMedia("(display-mode: minimal-ui)");
  if (mqMin.matches) return "minimal-ui";

  return "browser";
}

function getIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function usePwaMode(): PwaMode {
  const [mode, setMode] = useState<PwaMode>(() => ({
    isPwa: false,
    displayMode: "browser",
    isMobile: false,
    isDesktop: true,
    prefersReducedMotion: false,
  }));

  useEffect(() => {
    function update() {
      const displayMode = getDisplayMode();
      const isMobile = getIsMobile();
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setMode({
        isPwa: displayMode !== "browser",
        displayMode,
        isMobile,
        isDesktop: !isMobile,
        prefersReducedMotion,
      });
    }

    update();

    // Listen for display-mode changes (e.g. browser-installed PWA)
    const mql = window.matchMedia("(display-mode: standalone)");
    mql.addEventListener("change", update);
    const mqlFull = window.matchMedia("(display-mode: fullscreen)");
    mqlFull.addEventListener("change", update);

    // Listen for resize (mobile/desktop switch)
    const mqlMobile = window.matchMedia("(max-width: 767px)");
    mqlMobile.addEventListener("change", update);

    return () => {
      mql.removeEventListener("change", update);
      mqlFull.removeEventListener("change", update);
      mqlMobile.removeEventListener("change", update);
    };
  }, []);

  return mode;
}
