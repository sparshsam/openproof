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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[6px] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0a0a0a]"
          href="#main-content"
        >
          Skip to content
        </a>

        {/* ── Header ───────────────────────────────────────
            Per INFORMATION_ARCHITECTURE §2.1:
            OpenProof  Create Proof  Verify Proof  Docs  GitHub
            No logo image, no icons, no "Start" CTA.
            ───────────────────────────────────────────── */}

        <header className="sticky top-0 z-50 border-b border-border-default bg-bg-base">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link
              className="text-base font-semibold tracking-tight text-text-primary"
              href="/"
            >
              OpenProof
            </Link>

            <nav
              className="flex items-center gap-5 text-sm text-text-secondary"
              aria-label="Main navigation"
            >
              <Link
                className="transition-colors hover:text-text-primary"
                href="/create"
              >
                Create Proof
              </Link>
              <Link
                className="transition-colors hover:text-text-primary"
                href="/verify"
              >
                Verify Proof
              </Link>
              <Link
                className="transition-colors hover:text-text-primary"
                href="/docs"
              >
                Docs
              </Link>
              <a
                className="inline-flex items-center gap-1 transition-colors hover:text-text-primary"
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
            Per INFORMATION_ARCHITECTURE §2.3:
            GitHub · Contract 0x60d3... · License AGPL-3.0 · v0.1.1
            Privacy · Terms · Support via GitHub Issues
            ───────────────────────────────────────────── */}

        <footer className="border-t border-border-default px-5 py-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 text-center text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              OpenProof &mdash; cryptographic proof infrastructure
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-2">
              <a
                className="transition-colors hover:text-text-secondary"
                href="https://github.com/sparshsam/openproof"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <span>&middot;</span>
              <a
                className="transition-colors hover:text-text-secondary"
                href="https://github.com/sparshsam/openproof/blob/main/docs/PRIVACY.md"
                rel="noreferrer"
                target="_blank"
              >
                Privacy
              </a>
              <span>&middot;</span>
              <a
                className="transition-colors hover:text-text-secondary"
                href="https://github.com/sparshsam/openproof/blob/main/docs/TERMS.md"
                rel="noreferrer"
                target="_blank"
              >
                Terms
              </a>
              <span>&middot;</span>
              <span className="font-mono">{`${registryAddress.slice(0, 10)}...${registryAddress.slice(-4)}`}</span>
              <span>&middot;</span>
              AGPL-3.0
              <span>&middot;</span>
              v0.1.1
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
