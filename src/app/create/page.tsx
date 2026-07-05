"use client";

import { Label } from "@/components/design-system";
import { CreateProofForm } from "@/components/create-proof-form";

export default function CreateProofPage() {
  return (
    <main>
      {/* ── Header ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <Label color="accent">Create Proof</Label>
        <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Register a file fingerprint
          <br /><span className="text-text-secondary">on Base Sepolia.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          Timestamp a SHA-256 fingerprint onchain. Prove a file existed at this moment.
          The file never leaves your browser.
        </p>
      </section>

      {/* ── Transaction flow — vertical, no cards ────── */}
      <section className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
        <CreateProofForm />
      </section>
    </main>
  );
}
