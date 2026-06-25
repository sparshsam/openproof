// ── OpenProof Chain Registry ──
// Network abstraction architecture for multi-EVM chain support.
// Add chains here to extend support. Base Mainnet is prepared but not active
// until the app is deployed and tested there.

import { baseSepolia, base, type Chain } from "wagmi/chains";

export type ChainConfig = {
  /** The wagmi/viem chain definition */
  chain: Chain;
  /** Human-readable label shown in the UI */
  label: string;
  /** Whether this chain is currently active in the app */
  active: boolean;
  /** Short symbol for the chain (used in proof URLs, labels) */
  symbol: string;
  /** Native currency symbol */
  currency: string;
  /** Block explorer base URL */
  explorerUrl: string;
  /** OpenProof registry contract address on this chain */
  contractAddress: `0x${string}` | undefined;
  /** Registry contract version (incremented on deployment) */
  registryVersion: number;
  /** Whether this is a testnet */
  isTestnet: boolean;
};

// ── Chain configuration ──
// Active chain is determined by NEXT_PUBLIC_CHAIN_ID env var.
// Base Mainnet is pre-configured but not active until switched.

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // Base Sepolia (testnet — active by default)
  [baseSepolia.id]: {
    chain: baseSepolia,
    label: "Base Sepolia",
    active: true,
    symbol: "base-sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.basescan.org",
    contractAddress: process.env
      .NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS as `0x${string}` | undefined,
    registryVersion: 1,
    isTestnet: true,
  },
  // Base Mainnet (prepared, not active until deployed)
  [base.id]: {
    chain: base,
    label: "Base",
    active: false,
    symbol: "base",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    contractAddress: undefined, // Not deployed yet
    registryVersion: 1,
    isTestnet: false,
  },
};

/** Get the active chain config based on NEXT_PUBLIC_CHAIN_ID */
export function getActiveChainConfig(): ChainConfig {
  const configuredId = Number(
    process.env.NEXT_PUBLIC_CHAIN_ID || baseSepolia.id,
  );
  return (
    CHAIN_CONFIGS[configuredId] || CHAIN_CONFIGS[baseSepolia.id]
  );
}

/** Get the wagmi chain for a given chain ID */
export function getWagmiChain(chainId: number): Chain {
  return CHAIN_CONFIGS[chainId]?.chain || baseSepolia;
}

/** Get chain config by ID */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS[chainId];
}

/** List all available chains (active + inactive) */
export function getAllChainConfigs(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS);
}

/** List only active chains */
export function getActiveChainConfigs(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS).filter((c) => c.active);
}

/** Get the chain symbol (used in chain-aware proof URLs) */
export function getChainSymbol(chainId: number): string {
  return CHAIN_CONFIGS[chainId]?.symbol || "unknown";
}

/** Get a chain-aware proof path: /proof/<hash>?chain=<symbol> or /<symbol>/proof/<hash> */
export function getChainAwareProofPath(hash: string, chainId: number): string {
  const symbol = getChainSymbol(chainId);
  // Use query param for now — simpler and backward-compatible
  return `/proof/${hash}?chain=${symbol}`;
}

/** Get the default active chain */
export const defaultActiveChainConfig = getActiveChainConfig();
