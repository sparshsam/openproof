"use client";

// ── Wallet state helpers for disconnect/reconnect handling ──

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useCallback } from "react";
import { expectedChainId, openProofChain } from "@/lib/contracts";

export type WalletState = {
  isConnected: boolean;
  address: string | undefined;
  chainId: number;
  isCorrectChain: boolean;
  isSwitching: boolean;
  needsReconnect: boolean;
};

/**
 * Hook that returns wallet state including chain awareness.
 * Use this instead of raw wagmi hooks for consistent state handling.
 */
export function useWalletState(): WalletState & {
  switchToCorrectChain: () => void;
} {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectChain = isConnected && chainId === expectedChainId;

  const switchToCorrectChain = useCallback(() => {
    if (!isCorrectChain && isConnected) {
      switchChain({ chainId: openProofChain.id });
    }
  }, [isCorrectChain, isConnected, switchChain]);

  return {
    isConnected,
    address,
    chainId,
    isCorrectChain,
    isSwitching,
    needsReconnect: !isConnected,
    switchToCorrectChain,
  };
}

/**
 * Build a human-readable wallet connection hint based on state.
 */
export function getWalletHint(state: WalletState): string | null {
  if (!state.isConnected) {
    return "Connect a wallet to register proofs onchain.";
  }
  if (!state.isCorrectChain) {
    return `Switch to ${openProofChain.name} to continue.`;
  }
  return null;
}
