import { hashFileSha256, type HashedFile } from "@/lib/hash";

export type BundleManifestFile = {
  name: string;
  size: number;
  type: string;
  sha256: `0x${string}`;
};

export type BundleManifest = {
  appName: "OpenProof";
  bundleVersion: 1;
  bundleRuleVersion: 1;
  hashAlgorithm: "SHA-256";
  rule: "sort-by-name-size-type-hash";
  files: BundleManifestFile[];
};

export async function hashBundleFiles(files: File[]) {
  const hashedFiles = await Promise.all(
    files.map(async (file): Promise<HashedFile> => ({
      file,
      sha256: await hashFileSha256(file),
    })),
  );

  const manifest: BundleManifest = {
    appName: "OpenProof",
    bundleVersion: 1,
    bundleRuleVersion: 1,
    hashAlgorithm: "SHA-256",
    rule: "sort-by-name-size-type-hash",
    files: hashedFiles
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
      ),
  };

  const encoded = new TextEncoder().encode(stableStringify(manifest));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  const bundleHash = `0x${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}` as `0x${string}`;

  return { bundleHash, manifest };
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
