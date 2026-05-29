"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useState } from "react";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "OPENPROOF_LOCAL_ONLY";

const config = getDefaultConfig({
  appName: "OpenProof",
  projectId,
  chains: [baseSepolia],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#0052ff",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
