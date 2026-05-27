export type HashedFile = {
  file: File;
  sha256: `0x${string}`;
};

export async function hashFileSha256(file: File): Promise<`0x${string}`> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return `0x${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function shortenHash(hash: string, chars = 12) {
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}
