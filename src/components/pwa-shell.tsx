"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/providers/theme-provider";
import { OnlineStatusBadge } from "@/components/pwa-status-badge";
import { PwaBottomNav } from "@/components/pwa-bottom-nav";
import { RouteProgress } from "@/components/route-progress";

const navLinks: Array<{ href: string; label: string; matchPaths?: string[] }> = [
  { href: "/create", label: "Create", matchPaths: ["/create", "/app"] },
  { href: "/app/verify", label: "Verify" },
  { href: "/app/history", label: "History" },
  { href: "/app/more", label: "More" },
];

export function PwaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <RouteProgress />
      {/* Compact app header */}
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-base/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              className="flex items-center gap-1.5 group shrink-0"
              href="/app"
              aria-label="OpenProof home"
            >
              <style>{`
                [data-theme="dark"] .pwa-icon-light { opacity: 0 !important; }
                [data-theme="dark"] .pwa-icon-dark { opacity: 1 !important; }
              `}</style>
              <div className="relative size-6 shrink-0">
                <img alt="" className="pwa-icon-light absolute inset-0 size-6 rounded transition-opacity duration-300" src="/icon-header.png" />
                <img alt="" className="pwa-icon-dark absolute inset-0 size-6 rounded transition-opacity duration-300 opacity-0" src="/icon-header-dark.png" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-muted opacity-50">
                  OPEN
                </span>
                <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors -mt-0.5">
                  Proof
                </span>
              </div>
            </Link>

            {/* Desktop nav — hidden on mobile (bottom nav handles it) */}
            <nav className="hidden md:flex items-center gap-1" aria-label="App navigation">
              {navLinks.map(({ href, label, matchPaths }) => {
                const isActive = (matchPaths ?? [href]).some((p) => pathname === p || pathname.startsWith(p + "/"));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-bg-surface-muted hover:text-text-primary"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <OnlineStatusBadge />
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wider">
              Base Sepolia
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content — flex-1 pushes footer to the bottom */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <PwaBottomNav />

      {/* Footer — Kovina wordmark (desktop only; mobile has bottom nav) */}
      <footer className="hidden md:block border-t border-border-default py-6 text-center">
        <a className="inline-block" href="https://kovina.org" rel="noreferrer" target="_blank" aria-label="Kovina">
          <style>{`
            [data-theme="dark"] .pwa-kovina-light { opacity: 0 !important; }
            [data-theme="dark"] .pwa-kovina-dark { opacity: 1 !important; }
          `}</style>
          <span className="relative inline-block h-[18px] w-[140px] sm:w-[180px] align-middle">
            <img alt="" className="pwa-kovina-light absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300" src="/kovina-wordmark.svg" />
            <img alt="" className="pwa-kovina-dark absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300 opacity-0" src="/kovina-wordmark-white.svg" />
          </span>
        </a>
      </footer>
    </div>
  );
}
