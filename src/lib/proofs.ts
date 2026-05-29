import { parseAbiItem, type PublicClient } from "viem";
import { openProofAbi, openProofContractAddress } from "@/lib/contracts";

export type OnchainProof = {
  creator: string;
  timestamp: string;
  fileHash: `0x${string}`;
  transactionHash?: string;
};

export function isBytes32Hash(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

export async function readOnchainProof(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<OnchainProof | null> {
  if (!openProofContractAddress) return null;

  const exists = await publicClient.readContract({
    abi: openProofAbi,
    address: openProofContractAddress,
    functionName: "proofExists",
    args: [fileHash],
  });

  if (!exists) return null;

  const proof = await publicClient.readContract({
    abi: openProofAbi,
    address: openProofContractAddress,
    functionName: "getProof",
    args: [fileHash],
  });

  const transactionHash = await findProofTransactionHash(publicClient, fileHash).catch(
    () => undefined,
  );

  return {
    creator: proof.creator,
    timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
    fileHash: proof.fileHash,
    transactionHash,
  };
}

export async function findProofTransactionHash(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
) {
  if (!openProofContractAddress) return undefined;

  const latestBlock = await publicClient.getBlockNumber();
  const chunkSize = 1_900n;
  const maxLookback = 50_000n;
  const floorBlock =
    latestBlock > maxLookback ? latestBlock - maxLookback : 0n;
  let toBlock = latestBlock;

  while (toBlock >= floorBlock) {
    const fromBlock =
      toBlock > chunkSize && toBlock - chunkSize > floorBlock
        ? toBlock - chunkSize
        : floorBlock;

    const logs = await publicClient.getLogs({
      address: openProofContractAddress,
      event: parseAbiItem(
        "event ProofRegistered(bytes32 indexed fileHash, address indexed creator, uint64 timestamp)",
      ),
      args: { fileHash },
      fromBlock,
      toBlock,
    });

    const log = logs.at(-1);
    if (log?.transactionHash) return log.transactionHash;
    if (fromBlock === 0n || fromBlock === floorBlock) break;
    toBlock = fromBlock - 1n;
  }

  return undefined;
}

