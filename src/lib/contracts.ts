import {
  defaultActiveChainConfig,
  getChainConfig,
} from "@/lib/chains";

export const openProofAbi = [
  {
    type: "function",
    name: "registerProof",
    stateMutability: "nonpayable",
    inputs: [{ name: "fileHash", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getProof",
    stateMutability: "view",
    inputs: [{ name: "fileHash", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "creator", type: "address" },
          { name: "timestamp", type: "uint64" },
          { name: "fileHash", type: "bytes32" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "proofExists",
    stateMutability: "view",
    inputs: [{ name: "fileHash", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "registryVersion",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "ProofRegistered",
    inputs: [
      { name: "fileHash", type: "bytes32", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "timestamp", type: "uint64", indexed: false },
    ],
    anonymous: false,
  },
] as const;

/** The chain config the app is currently targeting */
export const openProofChainConfig = defaultActiveChainConfig;

/** The wagmi chain the app is currently targeting */
export const openProofChain = openProofChainConfig.chain;

/** The contract address on the active chain */
export const openProofContractAddress = openProofChainConfig.contractAddress;

/** The expected chain ID for the active chain */
export const expectedChainId = openProofChainConfig.chain.id;

/** The registry version for the active chain */
export const openProofRegistryVersion = openProofChainConfig.registryVersion;

/** Get the chain config for a given chain ID, or the default */
export function getContractForChain(
  chainId: number,
): { chain: (typeof openProofChain); contractAddress: `0x${string}` | undefined } | undefined {
  const config = getChainConfig(chainId);
  if (!config) return undefined;
  return {
    chain: config.chain,
    contractAddress: config.contractAddress,
  };
}

/** Check if the active chain's contract is configured */
export function isContractConfigured() {
  return Boolean(
    openProofChainConfig.contractAddress?.match(/^0x[a-fA-F0-9]{40}$/),
  );
}
