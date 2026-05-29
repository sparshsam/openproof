import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { ButtonLink } from "@/components/design-system";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link className="flex items-center gap-2" href="/">
              <span className="grid size-9 place-items-center rounded-2xl bg-base-blue text-white shadow-[0_12px_30px_rgba(0,82,255,0.28)]">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-lg font-black tracking-tight">OpenProof</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <Link className="hover:text-foreground" href="/create">
                Create Proof
              </Link>
              <Link className="hover:text-foreground" href="/verify">
                Verify Proof
              </Link>
              <Link className="hover:text-foreground" href="/#privacy">
                Docs
              </Link>
            </nav>
            <div className="hidden sm:block">
              <ButtonLink href="/create">Start</ButtonLink>
            </div>
          </div>
        </header>
        {children}
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
