import { hashFileSha256, type HashedFile } from "@/lib/hash";
import {
  buildMerkleTree,
  generateMerkleProof,
  type MerkleProof,
} from "@/lib/merkle";

export type BundleManifestFile = {
  name: string;
  size: number;
  type: string;
  sha256: `0x${string}`;
};

export type BundleManifest = {
  appName: "OpenProof";
  bundleVersion: 1;
  bundleRuleVersion: number;
  hashAlgorithm: "SHA-256";
  rule: "merkle-sort-by-name-size-type-hash";
  merkleRoot: `0x${string}`;
  files: BundleManifestFile[];
};

export type BundleResult = {
  bundleHash: `0x${string}`;
  merkleRoot: `0x${string}`;
  manifest: BundleManifest;
  tree: `0x${string}`[][];
  leaves: `0x${string}`[];
};

export async function hashBundleFiles(files: File[]): Promise<BundleResult> {
  const hashedFiles = await Promise.all(
    files.map(async (file): Promise<HashedFile> => ({
      file,
      sha256: await hashFileSha256(file),
    })),
  );

  const sorted = hashedFiles
    .map(({ file, sha256 }) => ({
      name: file.name,
      size: file.size,
      type: file.type || "unknown",
      sha256,
    }))
    .sort((a, b) =>
      `${a.name}:${a.size}:${a.type}:${a.sha256}`.localeCompare(
        `${b.name}:${b.size}:${b.type}:${b.sha256}`,
      ),
    );

  const leaves = sorted.map((f) => f.sha256);
  const { root: merkleRoot, tree } = await buildMerkleTree(leaves);

  const manifest: BundleManifest = {
    appName: "OpenProof",
    bundleVersion: 1,
    bundleRuleVersion: 2,
    hashAlgorithm: "SHA-256",
    rule: "merkle-sort-by-name-size-type-hash",
    merkleRoot,
    files: sorted,
  };

  return {
    bundleHash: merkleRoot,
    merkleRoot,
    manifest,
    tree,
    leaves,
  };
}

/** Generate a Merkle inclusion proof for a specific file in a bundle */
export function generateBundleProof(
  manifest: BundleManifest,
  tree: `0x${string}`[][],
  targetFileName: string,
): MerkleProof | null {
  const leaves = manifest.files.map((f) => f.sha256);
  const fileEntry = manifest.files.find((f) => f.name === targetFileName);
  if (!fileEntry) return null;

  return generateMerkleProof(fileEntry.sha256, tree, leaves);
}

/** Verify that a file belongs to a bundle by its Merkle proof */
export async function verifyBundleInclusion(
  fileSha256: `0x${string}`,
  proof: MerkleProof,
  expectedMerkleRoot: `0x${string}`,
): Promise<boolean> {
  const { valid } = await (async () => {
    let computed: `0x${string}` = fileSha256;
    let idx = proof.index;

    for (const sibling of proof.siblings) {
      computed =
        idx % 2 === 0
          ? await (async () => {
              const combined = new Uint8Array(64);
              combined.set(hexToBytes(computed), 0);
              combined.set(hexToBytes(sibling), 32);
              const digest = await crypto.subtle.digest("SHA-256", combined);
              return bytesToHex(new Uint8Array(digest));
            })()
          : await (async () => {
              const combined = new Uint8Array(64);
              combined.set(hexToBytes(sibling), 0);
              combined.set(hexToBytes(computed), 32);
              const digest = await crypto.subtle.digest("SHA-256", combined);
              return bytesToHex(new Uint8Array(digest));
            })();
      idx = Math.floor(idx / 2);
    }

    return { valid: computed === expectedMerkleRoot };
  })();

  return valid;
}

// ── Helpers ──

function hexToBytes(hex: `0x${string}`): Uint8Array {
  const raw = hex.slice(2);
  const bytes = new Uint8Array(raw.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(raw.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): `0x${string}` {
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}
