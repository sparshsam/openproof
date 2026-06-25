import type { Metadata } from "next";
import { ProofExplorerClient } from "@/app/proof/[hash]/proof-explorer-client";

export function generateMetadata(): Metadata {
  return {
    title: "OpenProof verification page",
    description:
      "View a Base Sepolia proof-of-existence record for an OpenProof SHA-256 fingerprint.",
    openGraph: {
      title: "OpenProof verification page",
      description:
        "View a Base Sepolia proof-of-existence record for an OpenProof SHA-256 fingerprint.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "OpenProof verification page",
      description:
        "View a Base Sepolia proof-of-existence record for an OpenProof SHA-256 fingerprint.",
    },
    alternates: {
      canonical: `/proof/`,
    },
  };
}

export default async function ProofPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  return <ProofExplorerClient hash={hash} />;
}
