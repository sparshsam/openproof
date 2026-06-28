"use client";

import { useEffect, useState, useCallback } from "react";

const DISMISSED_KEY = "openproof-install-dismissed";
const RE_SHOW_AFTER_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

function isDismissedRecently(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (!stored) return false;
    const dismissedAt = parseInt(stored, 10);
    if (isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < RE_SHOW_AFTER_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Listen for beforeinstallprompt
  useEffect(() => {
    // If user dismissed recently, don't intercept — let Chrome handle it
    if (isDismissedRecently()) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      // Only preventDefault if we intend to show our own prompt
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay — don't interrupt initial load
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // Check for updates periodically
    const interval = setInterval(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }, 60 * 60 * 1000); // every hour

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      clearInterval(interval);
    };
  }, []);

  // Listen for updatefound on SW registration
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New version available
            setUpdateAvailable(true);
          }
        });
      });
    });
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setDeferredPrompt(null);
    markDismissed();
  }, []);

  const handleUpdate = useCallback(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" });
    setUpdateAvailable(false);
  }, []);

  if (!showPrompt && !updateAvailable) return null;

  return (
    <>
      {/* Install prompt */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-center gap-3 rounded-full border border-border-default bg-bg-surface px-5 py-3 shadow-xl backdrop-blur-md">
            <img alt="" className="size-6 shrink-0" src="/icon.svg" />
            <span className="text-sm font-semibold text-text-primary">Install OpenProof</span>
            <button
              className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white transition hover:bg-accent/90 active:scale-[0.97]"
              onClick={handleInstall}
              type="button"
            >
              Install
            </button>
            <button
              aria-label="Dismiss install prompt"
              className="rounded-full px-2 py-1.5 text-xs text-text-secondary transition hover:text-text-primary"
              onClick={handleDismiss}
              type="button"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Update available prompt */}
      {updateAvailable && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <button
            className="animate-in slide-in-from-bottom-4 fade-in rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-accent/90 active:scale-[0.97]"
            onClick={handleUpdate}
            type="button"
          >
            Update available — refresh
          </button>
        </div>
      )}
    </>
  );
}
