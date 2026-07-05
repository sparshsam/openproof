import Link from "next/link";
import { ThemeToggle } from "@/components/providers/theme-provider";
import { RouteProgress } from "@/components/route-progress";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <RouteProgress />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link className="flex items-center gap-1.5 group shrink-0" href="/" aria-label="OpenProof home">
                <style>{`
                  [data-theme="dark"] .icon-light-proof { opacity: 0 !important; }
                  [data-theme="dark"] .icon-dark-proof { opacity: 1 !important; }
                `}</style>
                <div className="relative size-7 sm:size-8 shrink-0">
                  <img alt="" className="icon-light-proof absolute inset-0 size-7 sm:size-8 rounded-lg transition-opacity duration-300" src="/icon-header.png" />
                  <img alt="" className="icon-dark-proof absolute inset-0 size-7 sm:size-8 rounded-lg transition-opacity duration-300 opacity-0" src="/icon-header-dark.png" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-text-muted opacity-50">
                    OPEN
                  </span>
                  <span className="text-sm sm:text-[15px] font-medium text-text-primary group-hover:text-accent transition-colors -mt-0.5">
                    Proof
                  </span>
                </div>
              </Link>
              <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
                <Link className="rounded-full px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/create">
                  Create
                </Link>
                <Link className="rounded-full px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/verify">
                  Verify
                </Link>
                <Link className="rounded-full px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/about">
                  About
                </Link>
                <a className="rounded-full px-4 py-2 text-sm font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">
                  GitHub
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <nav className="flex items-center gap-1 sm:hidden" aria-label="Main navigation">
                <Link className="rounded-full px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/create">
                  Create
                </Link>
                <Link className="rounded-full px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/verify">
                  Verify
                </Link>
                <Link className="rounded-full px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-bg-surface-muted hover:text-text-primary" href="/about">
                  About
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div id="main-content">{children}</div>

        <footer className="border-t border-border-default px-6 py-4 sm:py-5">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <a className="inline-flex items-center" href="https://kovina.org" rel="noreferrer" target="_blank" aria-label="Kovina">
              <style>{`
                [data-theme="dark"] .kovina-logo-light { opacity: 0 !important; }
                [data-theme="dark"] .kovina-logo-dark { opacity: 1 !important; }
              `}</style>
              <div className="relative h-[18px] w-[140px] sm:w-[180px]">
                <img alt="" className="kovina-logo-light absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300" src="/kovina-wordmark.svg" />
                <img alt="" className="kovina-logo-dark absolute inset-0 h-[18px] w-[140px] sm:w-[180px] transition-opacity duration-300 opacity-0" src="/kovina-wordmark-white.svg" />
              </div>
            </a>
            <div className="flex items-center gap-4 text-xs">
              <Link className="transition hover:text-text-primary text-text-secondary" href="/about">About</Link>
              <Link className="transition hover:text-text-primary text-text-secondary" href="/privacy">Privacy</Link>
              <Link className="transition hover:text-text-primary text-text-secondary" href="/terms">Terms</Link>
              <a className="transition hover:text-text-primary text-text-secondary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
  );
}
