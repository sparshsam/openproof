import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { WalletProvider } from "@/components/providers/wallet-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen">
        <header className="border-b border-border bg-surface/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link className="flex items-center gap-2" href="/">
              <span className="grid size-8 place-items-center rounded-md border border-border bg-surface-muted">
                <ShieldCheck className="size-4 text-accent" />
              </span>
              <span className="font-semibold tracking-tight">OpenProof</span>
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
            <Link
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-muted"
              href="/create"
            >
              Start
            </Link>
          </div>
        </header>
        {children}
        <footer className="border-t border-border bg-surface px-5 py-6">
          <div className="mx-auto max-w-6xl text-sm text-muted">
            OpenProof is an open-source proof-of-existence app built on Base.
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
