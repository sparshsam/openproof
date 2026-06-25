import type { Metadata } from "next";
import { BundleExplorerClient } from "./bundle-explorer-client";

export function generateMetadata(): Metadata {
  return {
    title: "Bundle proof",
    description:
      "View a bundle proof — file list, Merkle root, and individual inclusion proofs.",
    openGraph: {
      title: "OpenProof bundle proof",
      description:
        "View a bundle proof — file list, Merkle root, and individual inclusion proofs.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "OpenProof bundle proof",
      description:
        "View a bundle proof — file list, Merkle root, and individual inclusion proofs.",
    },
  };
}

export default async function BundleExplorerPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  return <BundleExplorerClient hash={hash} />;
}
