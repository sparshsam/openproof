// ── Browser-local bundle manifest storage ──

const bundleStorageKey = "openproof:bundle:";
const maxBundleManifests = 20;

/** Store a bundle manifest in localStorage so the bundle explorer can display it */
export function storeBundleManifest(hash: string, manifest: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${bundleStorageKey}${hash}`, JSON.stringify(manifest));
    // Enforce max manifests
    trimBundleStorage();
  } catch {
    // localStorage full — silently ignore
  }
}

/** Retrieve a stored bundle manifest */
export function getBundleManifest(hash: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${bundleStorageKey}${hash}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Check if a bundle manifest exists in storage */
export function hasBundleManifest(hash: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${bundleStorageKey}${hash}`) !== null;
}

/** Get all stored bundle hashes */
export function getBundleManifestHashes(): string[] {
  if (typeof window === "undefined") return [];
  const hashes: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(bundleStorageKey)) {
      hashes.push(key.slice(bundleStorageKey.length));
    }
  }
  return hashes;
}

/** Remove a stored bundle manifest */
export function removeBundleManifest(hash: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${bundleStorageKey}${hash}`);
}

function trimBundleStorage(): void {
  const keys: { key: string; ts: number }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(bundleStorageKey)) {
      keys.push({ key, ts: Date.now() });
    }
  }
  if (keys.length <= maxBundleManifests) return;
  // Sort oldest first, remove excess
  keys.sort((a, b) => a.ts - b.ts);
  for (let i = 0; i < keys.length - maxBundleManifests; i++) {
    localStorage.removeItem(keys[i].key);
  }
}

/** Download a bundle manifest as a standalone JSON file */
export function downloadBundleManifest(hash: string, manifest: unknown): void {
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `openproof-bundle-${hash.slice(2, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
