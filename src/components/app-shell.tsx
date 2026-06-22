import Link from "next/link";
import { WalletProvider } from "@/components/providers/wallet-provider";

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
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Link className="text-lg font-bold tracking-tight text-text-primary" href="/">
              OpenProof
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold text-text-secondary" aria-label="Main navigation">
              <Link className="rounded-full px-4 py-2 transition hover:bg-bg-surface-muted hover:text-text-primary" href="/create">Create</Link>
              <Link className="rounded-full px-4 py-2 transition hover:bg-bg-surface-muted hover:text-text-primary" href="/verify">Verify</Link>
              <a className="rounded-full px-4 py-2 transition hover:bg-bg-surface-muted hover:text-text-primary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">GitHub</a>
            </nav>
          </div>
        </header>

        <div id="main-content">{children}</div>

        <footer className="border-t border-border-default px-6 py-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>OpenProof &mdash; cryptographic proof infrastructure</p>
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <a className="transition hover:text-text-primary" href="https://github.com/sparshsam/openproof" rel="noreferrer" target="_blank">GitHub</a>
              <a className="transition hover:text-text-primary" href="https://github.com/sparshsam/openproof/blob/main/docs/PRIVACY.md" rel="noreferrer" target="_blank">Privacy</a>
              <a className="transition hover:text-text-primary" href="https://github.com/sparshsam/openproof/blob/main/docs/TERMS.md" rel="noreferrer" target="_blank">Terms</a>
              <span className="text-text-muted">AGPL-3.0</span>
              <span className="text-text-muted">v0.1.1</span>
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
