export function proofPath(hash: string) {
  return `/proof/${hash}`;
}

export function proofUrl(hash: string, origin: string) {
  return `${origin}${proofPath(hash)}`;
}

