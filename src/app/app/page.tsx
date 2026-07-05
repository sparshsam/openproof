"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FileUp, Search, ShieldCheck, FileBox } from "lucide-react";
import { AppSplash } from "@/components/app-splash";
import { ProofHistory } from "@/components/proof-history";

export default function AppPage() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <AppSplash onDone={handleSplashDone} />;
  }

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/create"
          className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-accent/50 hover:bg-accent/[0.02]"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <FileUp className="size-6 text-accent" />
          </div>
          <div>
            <p className="font-bold text-text-primary">Create proof</p>
            <p className="mt-0.5 text-sm text-text-secondary">
              Hash a file and register on Base Sepolia
            </p>
          </div>
        </Link>

        <Link
          href="/verify"
          className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-accent/50 hover:bg-accent/[0.02]"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Search className="size-6 text-accent" />
          </div>
          <div>
            <p className="font-bold text-text-primary">Verify proof</p>
            <p className="mt-0.5 text-sm text-text-secondary">
              Check a fingerprint against the registry
            </p>
          </div>
        </Link>
      </div>

      {/* History */}
      <section>
        <ProofHistory title="Recent proofs" type="registered" />
      </section>

      {/* Bundle proofs CTA */}
      <Link
        href="/create"
        className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-5 transition hover:border-accent/50"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <FileBox className="size-6 text-accent" />
        </div>
        <div>
          <p className="font-bold text-text-primary">Bundle proofs</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            Register multiple files as a single combined proof
          </p>
        </div>
      </Link>

      {/* Testnet notice */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-text-muted" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Base Sepolia testnet
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              OpenProof runs on Base Sepolia — a test network. Proofs here are
              for experimentation and verification. No real value is involved.
            </p>
          </div>
        </div>
      </div>

      {/* Footer spacer for bottom nav on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
