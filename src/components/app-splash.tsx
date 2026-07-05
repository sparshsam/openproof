"use client";

import { useEffect, useState } from "react";
import { usePwaMode } from "@/lib/use-pwa-mode";

const SPLASH_DURATION = 600; // ms — fast enough to feel snappy

export function AppSplash({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const { prefersReducedMotion } = usePwaMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Let the fade-out CSS animation play before unmounting
      setTimeout(onDone, 250);
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg-base ${
        prefersReducedMotion ? "" : "animate-out fade-out"
      }`}
      style={{ animationDuration: "250ms", animationFillMode: "forwards" }}
    >
      <style>{`
        [data-theme="dark"] .splash-light { opacity: 0 !important; }
        [data-theme="dark"] .splash-dark { opacity: 1 !important; }
        @keyframes splash-pop {
          0% { opacity: 0; transform: scale(0.88); }
          100% { opacity: 1; transform: scale(1); }
        }
        .splash-icon {
          animation: splash-pop 300ms ease-out;
        }
        @keyframes splash-sweep {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          51%  { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        .splash-sweep {
          animation: splash-sweep ${SPLASH_DURATION}ms ease-in-out forwards;
        }
      `}</style>

      <div className="splash-icon relative size-20">
        <img
          alt=""
          className="splash-light absolute inset-0 size-20 rounded-2xl"
          src="/icon-192.png"
        />
        <img
          alt=""
          className="splash-dark absolute inset-0 size-20 rounded-2xl opacity-0"
          src="/icon-dark-192.png"
        />
      </div>

      <h1 className="mt-5 text-2xl font-black tracking-tight text-text-primary">
        OpenProof
      </h1>
      <p className="mt-1.5 text-sm text-text-secondary">
        Proof without surrender.
      </p>

      {/* Clean gradient sweep instead of three pulsing dots */}
      <div className="splash-sweep mt-8 h-0.5 w-16 rounded-full bg-accent" />
    </div>
  );
}
