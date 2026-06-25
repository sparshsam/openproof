import { getChainConfig, getActiveChainConfig } from "@/lib/chains";

/** Get the explorer URL for a given chain ID, or the active chain's default */
export function getExplorerUrl(chainId?: number): string {
  if (chainId) {
    const config = getChainConfig(chainId);
    if (config) return config.explorerUrl;
  }
  return getActiveChainConfig().explorerUrl;
}

/** Build a transaction explorer URL for any supported chain */
export function transactionExplorerUrl(hash: string, chainId?: number) {
  return `${getExplorerUrl(chainId)}/tx/${hash}`;
}

/** Build an address explorer URL for any supported chain */
export function addressExplorerUrl(address: string, chainId?: number) {
  return `${getExplorerUrl(chainId)}/address/${address}`;
}
