"use client";

import { MoonStar, Sun } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// ── Module-level theme init ─────────────────────────────────
// Runs once on first client import, before React renders.
// Sets data-theme so there's no flash between SSR and hydration.
if (typeof window !== "undefined") {
  const t = localStorage.getItem("openproof-theme");
  if (t === "light" || t === "dark") {
    document.documentElement.setAttribute("data-theme", t);
  } else {
    document.documentElement.setAttribute(
      "data-theme",
      window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    );
  }
}

// ── Service worker registration ────────────────────────────
// Runs once at module level, deferred to avoid blocking paint.
if (typeof window !== "undefined" && "serviceWorker" in navigator && location.hostname !== "localhost") {
  window.addEventListener("load", function swListener() {
    navigator.serviceWorker.register("/sw.js").catch(function(){});
    window.removeEventListener("load", swListener);
  });
}

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("openproof-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("openproof-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-full p-2 text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary"
      type="button"
      onClick={toggle}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
    </button>
  );
}
