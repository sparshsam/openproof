"use client";

import { ProofHistory } from "@/components/proof-history";

export default function AppHistoryPage() {
  return (
    <div className="space-y-8">
      <ProofHistory title="Registered proofs" type="registered" />
      <ProofHistory title="Verified proofs" type="verified" />

      <div className="h-20 md:hidden" />
    </div>
  );
}
