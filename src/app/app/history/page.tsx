"use client";

import Link from "next/link";
import { FileBox, ShieldCheck } from "lucide-react";
import { ProofHistory } from "@/components/proof-history";

export default function AppHistoryPage() {
  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          History
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Proofs and verifications you&apos;ve completed in this browser.
        </p>
      </div>

      {/* Registered proofs */}
      <ProofHistory title="Registered proofs" type="registered" />

      {/* Verified proofs */}
      <ProofHistory title="Verified proofs" type="verified" />

      {/* Bundle proofs CTA */}
      <Link
        href="/app"
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
