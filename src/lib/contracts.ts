import { baseSepolia } from "wagmi/chains";

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

export const openProofChain = baseSepolia;

export const openProofContractAddress = process.env
  .NEXT_PUBLIC_OPENPROOF_CONTRACT_ADDRESS as `0x${string}` | undefined;

export const expectedChainId = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || baseSepolia.id,
);

export function isContractConfigured() {
  return Boolean(openProofContractAddress?.match(/^0x[a-fA-F0-9]{40}$/));
}
