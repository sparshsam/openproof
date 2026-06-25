// ── OpenProof Merkle Tree ──
// Implementation for bundle proof Merkle root registration
// and individual proof generation/inclusion verification.
//
// Tree: Binary Merkle tree using SHA-256.
// Leaves: SHA-256(file content) for each file.
// Internal: SHA-256(left || right) — concatenation, not double-hash.
// Order: Leaves sorted by (name, size, type, sha256) — same as bundle manifest.
// Root: Registered onchain as the bundle proof.

export type MerkleProof = {
  /** The leaf being proven */
  leaf: `0x${string}`;
  /** Position of the leaf in the sorted leaf array (0-indexed) */
  index: number;
  /** Sibling hashes from leaf to root (ordered bottom-up) */
  siblings: `0x${string}`[];
  /** The computed Merkle root */
  root: `0x${string}`;
};

/** Compute SHA-256 hash of concatenated 32-byte values */
export async function hashPair(
  left: `0x${string}`,
  right: `0x${string}`,
): Promise<`0x${string}`> {
  const combined = new Uint8Array(64);
  combined.set(hexToBytes(left), 0);
  combined.set(hexToBytes(right), 32);
  const digest = await crypto.subtle.digest("SHA-256", combined);
  return bytesToHex(new Uint8Array(digest));
}

/** Build a complete Merkle tree from sorted leaves, returning all levels */
export async function buildMerkleTree(
  leaves: `0x${string}`[],
): Promise<{ root: `0x${string}`; tree: `0x${string}`[][] }> {
  if (leaves.length === 0) {
    throw new Error("Cannot build Merkle tree with zero leaves.");
  }

  // Pad to power of 2
  const count = nextPowerOf2(leaves.length);
  const tree: `0x${string}`[][] = [];
  let level: `0x${string}`[] = [...leaves];

  // Pad with zero hash (empty leaf placeholder)
  const zeroHash = `0x${"00".repeat(32)}` as `0x${string}`;
  while (level.length < count) {
    level.push(zeroHash);
  }

  tree.push(level);

  // Build internal levels
  while (level.length > 1) {
    const nextLevel: `0x${string}`[] = [];
    for (let i = 0; i < level.length; i += 2) {
      nextLevel.push(await hashPair(level[i], level[i + 1]));
    }
    tree.push(nextLevel);
    level = nextLevel;
  }

  return { root: tree[tree.length - 1][0], tree };
}

/** Generate a Merkle inclusion proof for a specific leaf */
export function generateMerkleProof(
  leaf: `0x${string}`,
  tree: `0x${string}`[][],
  leaves: `0x${string}`[],
): MerkleProof {
  const index = leaves.findIndex((l) => l === leaf);
  if (index === -1) {
    throw new Error("Leaf not found in the Merkle tree.");
  }

  const siblings: `0x${string}`[] = [];
  let idx = index;

  for (let level = 0; level < tree.length - 1; level++) {
    const siblingIndex = idx % 2 === 0 ? idx + 1 : idx - 1;
    const sibling = tree[level][siblingIndex];
    if (sibling) {
      siblings.push(sibling);
    }
    idx = Math.floor(idx / 2);
  }

  return {
    leaf,
    index,
    siblings,
    root: tree[tree.length - 1][0],
  };
}

/** Verify a Merkle inclusion proof */
export async function verifyMerkleProof(
  proof: MerkleProof,
): Promise<boolean> {
  let computed: `0x${string}` = proof.leaf;
  let idx = proof.index;

  for (const sibling of proof.siblings) {
    computed =
      idx % 2 === 0
        ? await hashPair(computed, sibling)
        : await hashPair(sibling, computed);
    idx = Math.floor(idx / 2);
  }

  return computed === proof.root;
}

/** Verify a Merkle inclusion proof against a known root */
export async function verifyMerkleProofAgainstRoot(
  proof: MerkleProof,
  expectedRoot: `0x${string}`,
): Promise<{ valid: boolean; computedRoot: `0x${string}` }> {
  let computed: `0x${string}` = proof.leaf;
  let idx = proof.index;

  for (const sibling of proof.siblings) {
    computed =
      idx % 2 === 0
        ? await hashPair(computed, sibling)
        : await hashPair(sibling, computed);
    idx = Math.floor(idx / 2);
  }

  return { valid: computed === expectedRoot, computedRoot: computed };
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

function nextPowerOf2(n: number): number {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}
