"use client";

import Link from "next/link";
import { ExternalLink, ShieldCheck, BookOpen } from "lucide-react";

export default function AppMorePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">More</h1>

      <div className="space-y-3">
        <Link
          href="/about"
          className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-4 transition hover:border-accent/50"
        >
          <BookOpen className="size-5 text-accent" />
          <span className="font-semibold">About OpenProof</span>
        </Link>

        <Link
          href="/docs"
          className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-4 transition hover:border-accent/50"
        >
          <ShieldCheck className="size-5 text-accent" />
          <span className="font-semibold">Documentation</span>
        </Link>

        <a
          href="https://github.com/sparshsam/openproof"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-border-default bg-bg-surface p-4 transition hover:border-accent/50"
        >
          <span className="font-semibold">GitHub</span>
          <ExternalLink className="ml-auto size-4 text-text-muted" />
        </a>
      </div>

      {/* Testnet notice */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          OpenProof runs on <strong className="text-text-primary">Base Sepolia</strong> (testnet).
          All proofs are for experimental and verification purposes only.
        </p>
      </div>

      <p className="text-center text-xs text-text-muted">
        OpenProof v0.9.3 &middot; AGPL-3.0
      </p>

      <div className="h-20 md:hidden" />
    </div>
  );
}
