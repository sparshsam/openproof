import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { WalletProvider } from "@/components/providers/wallet-provider";

const registryAddress = "0x60d3DD631E6e4F6D76f761689d6FA229945a874a";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-bg-base text-text-primary">
        {/* Skip link */}
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>

        {/* ── Header ───────────────────────────────────────
            Clean, bold, minimal. Black bg, white text.
            No icons, no logos, no clutter.
            ───────────────────────────────────────────── */}

        <header className="sticky top-0 z-50 bg-bg-base/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <Link
              className="text-lg font-bold tracking-tight text-text-primary"
              href="/"
            >
              OpenProof
            </Link>

            <nav
              className="flex items-center gap-6 text-sm font-medium text-text-secondary"
              aria-label="Main navigation"
            >
              <Link
                className="transition-colors hover:text-text-primary"
                href="/create"
              >
                Create
              </Link>
              <Link
                className="transition-colors hover:text-text-primary"
                href="/verify"
              >
                Verify
              </Link>
              <a
                className="inline-flex items-center gap-1.5 transition-colors hover:text-text-primary"
                href="https://github.com/sparshsam/openproof"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
                <ExternalLink className="size-3" />
              </a>
            </nav>
          </div>
        </header>

        {/* ── Main Content ──────────────────────────────── */}

        <div id="main-content">{children}</div>

        {/* ── Footer ───────────────────────────────────────
            Minimal. Just the essentials.
            ───────────────────────────────────────────── */}

        <footer className="border-t border-border-default px-6 py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 text-center text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              OpenProof &mdash; cryptographic proof infrastructure
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a
                className="transition-colors hover:text-text-primary"
                href="https://github.com/sparshsam/openproof"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="transition-colors hover:text-text-primary"
                href="https://github.com/sparshsam/openproof/blob/main/docs/PRIVACY.md"
                rel="noreferrer"
                target="_blank"
              >
                Privacy
              </a>
              <a
                className="transition-colors hover:text-text-primary"
                href="https://github.com/sparshsam/openproof/blob/main/docs/TERMS.md"
                rel="noreferrer"
                target="_blank"
              >
                Terms
              </a>
              <span className="font-mono text-text-muted">{`${registryAddress.slice(0, 10)}...${registryAddress.slice(-4)}`}</span>
              <span className="text-text-muted">AGPL-3.0</span>
              <span className="text-text-muted">v0.1.1</span>
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
