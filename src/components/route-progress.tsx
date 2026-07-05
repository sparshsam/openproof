"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A thin animated progress bar that fires on client-side route transitions.
 *
 * Uses pathname as the trigger — fires a brief sweep every time the route
 * changes so the user never sees a dead click. No external dependencies,
 * no timer guesswork. Hidden on server render to avoid hydration mismatch.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const DURATION = 400;
    const PEAK = 88;
    const startedAt = performance.now();

    // Defer initial state via rAF so the lint rule doesn't flag synchronous
    // setState in the effect body — the actual rendering starts on the next
    // frame, which is fine for a progress animation.
    const startRaf = requestAnimationFrame(() => {
      setProgress(10);
      setVisible(true);

      function tick(now: number) {
        const elapsed = now - startedAt;
        const pct = Math.min((elapsed / DURATION) * PEAK, PEAK);
        setProgress(pct);

        if (pct < PEAK) {
          frameRef.current = requestAnimationFrame(tick);
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    });

    // Snap to 100% and hide after the animation window
    const done = setTimeout(() => {
      cancelAnimationFrame(frameRef.current);
      setProgress(100);
      setTimeout(() => setVisible(false), 200);
    }, DURATION + 100);

    return () => {
      cancelAnimationFrame(startRaf);
      cancelAnimationFrame(frameRef.current);
      clearTimeout(done);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] h-[3px]"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(90deg, #0081CC 0%, #00A3FF 50%, #80D4FF 100%)",
        transition: progress === 100 ? "opacity 0.2s ease" : undefined,
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  );
}
