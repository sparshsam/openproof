"use client";

import Link from "next/link";
import { usePwaMode } from "@/lib/use-pwa-mode";
import { ThemeToggle } from "@/components/providers/theme-provider";
import { OnlineStatusBadge } from "@/components/pwa-status-badge";
import { PwaBottomNav } from "@/components/pwa-bottom-nav";

export function PwaShell({ children }: { children: React.ReactNode }) {
  const { isMobile } = usePwaMode();

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Compact app header */}
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-base/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Link
            className="flex items-center gap-1.5 group shrink-0"
            href="/app"
            aria-label="OpenProof home"
          >
            <div className="relative size-6 shrink-0">
              <img
                alt=""
                className="absolute inset-0 size-6 rounded transition-opacity duration-300"
                src="/icon-header.png"
              />
              <img
                alt=""
                className="absolute inset-0 size-6 rounded transition-opacity duration-300 opacity-0"
                src="/icon-header-dark.png"
              />
            </div>
            <span className="text-sm font-bold text-text-primary">
              OpenProof
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <OnlineStatusBadge />
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">
              Base Sepolia
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 ${isMobile ? "pb-24" : ""}`}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <PwaBottomNav />
    </div>
  );
}
