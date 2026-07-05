"use client";

import Link from "next/link";
import { FileUp, Search } from "lucide-react";
import { CreateProofForm } from "@/components/create-proof-form";

export default function AppPage() {
  return (
    <>
      {/* ── Desktop: Landing page with two huge entry cards ── */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        {/* Page title */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.12em] uppercase text-text-muted">
            OpenProof
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-text-primary">
            Proof without surrender.
          </h1>
          <p className="mt-4 max-w-lg text-base text-text-secondary mx-auto">
            Hash a file locally. Register its fingerprint on Base Sepolia. The file never leaves your browser.
          </p>
        </div>

        {/* Action cards — clean, no containers */}
        <div className="grid w-full max-w-2xl grid-cols-2 gap-12">
          {/* Create card */}
          <Link
            href="/create"
            className="group flex flex-col items-center gap-6 transition-all hover:-translate-y-1"
          >
            <div className="flex size-28 items-center justify-center rounded-2xl bg-accent/10 transition-all group-hover:bg-accent/20 group-hover:scale-105">
              <FileUp className="size-14 text-accent" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-text-primary group-hover:text-accent transition-colors">
                Create Proof
              </h2>
              <p className="mt-2 max-w-52 text-sm text-text-secondary">
                Hash a file and register its fingerprint on the blockchain
              </p>
            </div>
          </Link>

          {/* Verify card */}
          <Link
            href="/app/verify"
            className="group flex flex-col items-center gap-6 transition-all hover:-translate-y-1"
          >
            <div className="flex size-28 items-center justify-center rounded-2xl bg-accent/10 transition-all group-hover:bg-accent/20 group-hover:scale-105">
              <Search className="size-14 text-accent" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-text-primary group-hover:text-accent transition-colors">
                Verify Proof
              </h2>
              <p className="mt-2 max-w-52 text-sm text-text-secondary">
                Check a fingerprint against the onchain registry
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Mobile: Direct create form (current behavior) ── */}
      <div className="md:hidden space-y-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            Create Proof
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Drop a file to hash it locally, then register its fingerprint on
            Base Sepolia. The file never leaves your browser.
          </p>
        </div>

        <CreateProofForm />

        {/* Footer spacer for bottom nav */}
        <div className="h-20" />
      </div>
    </>
  );
}
