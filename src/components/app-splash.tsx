"use client";

import { useEffect, useState } from "react";
import { usePwaMode } from "@/lib/use-pwa-mode";

const SPLASH_DURATION = 1200; // ms

export function AppSplash({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const { prefersReducedMotion } = usePwaMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Small delay after fade for React to settle
      setTimeout(onDone, 300);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg-base ${
        prefersReducedMotion ? "" : "animate-out fade-out"
      }`}
      style={{ animationDuration: "300ms", animationFillMode: "forwards" }}
    >
      <style>{`
        [data-theme="dark"] .splash-light { opacity: 0 !important; }
        [data-theme="dark"] .splash-dark { opacity: 1 !important; }
        @keyframes splash-fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .splash-icon {
          animation: splash-fade-in 400ms ease-out;
        }
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .splash-loader {
          animation: splash-pulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="splash-icon relative size-24">
        <img
          alt=""
          className="splash-light absolute inset-0 size-24 rounded-2xl"
          src="/icon-192.png"
        />
        <img
          alt=""
          className="splash-dark absolute inset-0 size-24 rounded-2xl opacity-0"
          src="/icon-dark-192.png"
        />
      </div>

      <h1 className="mt-6 text-2xl font-black tracking-tight text-text-primary">
        OpenProof
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Proof without surrender.
      </p>

      <div className="splash-loader mt-10 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-accent" />
        <span className="size-2 rounded-full bg-accent/60" />
        <span className="size-2 rounded-full bg-accent/30" />
      </div>
    </div>
  );
}
