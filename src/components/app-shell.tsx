import Link from "next/link";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { ThemeToggle } from "@/components/providers/theme-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-bg-base text-text-primary">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-text-primary" href="/">
                <img alt="" className="size-6" src="/icon-192x192.png" />
                OpenProof
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

        <footer className="border-t border-border-default px-6 py-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center text-xs text-text-secondary sm:flex-row sm:text-left">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link className="transition hover:text-text-primary" href="/about">About</Link>
              <Link className="transition hover:text-text-primary" href="/privacy">Privacy</Link>
              <Link className="transition hover:text-text-primary" href="/terms">Terms</Link>
              <a className="transition hover:text-text-primary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">GitHub</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-muted">AGPL-3.0</span>
              <span className="text-text-muted">v0.1.2</span>
            </div>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
