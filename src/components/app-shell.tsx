import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { ButtonLink } from "@/components/design-system";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-base-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link aria-label="OpenProof home" className="flex items-center gap-2" href="/">
              <span className="grid size-9 place-items-center rounded-2xl bg-base-blue text-white shadow-[0_12px_30px_rgba(0,82,255,0.28)]">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-lg font-black tracking-tight">OpenProof</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm text-muted md:gap-6" aria-label="Main navigation">
              <Link className="whitespace-nowrap rounded-full px-2 py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-blue" href="/create">
                Create Proof
              </Link>
              <Link className="whitespace-nowrap rounded-full px-2 py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-blue" href="/verify">
                Verify Proof
              </Link>
              <Link className="whitespace-nowrap rounded-full px-2 py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-blue" href="/#privacy-model">
                Docs
              </Link>
            </nav>
            <div className="hidden md:block">
              <ButtonLink href="/create">Start</ButtonLink>
            </div>
          </div>
        </header>
        <div id="main-content">{children}</div>
        <footer className="border-t border-border bg-base-dark px-5 py-10 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-blue-100">
              OpenProof is an open-source proof-of-existence app built on Base.
            </p>
            <p className="text-xs text-blue-200/75">Base Sepolia testnet - AGPLv3</p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
