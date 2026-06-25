import { getChainSymbol } from "@/lib/chains";

export function proofPath(hash: string, chainId?: number) {
  if (chainId) {
    return `/proof/${hash}?chain=${getChainSymbol(chainId)}`;
  }
  return `/proof/${hash}`;
}

export function proofUrl(hash: string, origin: string, chainId?: number) {
  return `${origin}${proofPath(hash, chainId)}`;
}
