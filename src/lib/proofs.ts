import { parseAbiItem, type PublicClient } from "viem";
import { openProofAbi, openProofContractAddress } from "@/lib/contracts";

export type OnchainProof = {
  creator: string;
  timestamp: string;
  fileHash: `0x${string}`;
  transactionHash?: string;
};

const transactionHashCache = new Map<string, string | undefined>();
const maxTransactionHashCacheEntries = 128;

export function isBytes32Hash(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

export async function readOnchainProof(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
  options: { includeTransactionHash?: boolean } = {},
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

  const transactionHash = options.includeTransactionHash
    ? await findProofTransactionHash(publicClient, fileHash).catch(() => undefined)
    : getCachedTransactionHash(fileHash);

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

  const cached = getCachedTransactionHash(fileHash);
  if (transactionHashCache.has(cacheKey(fileHash))) return cached;

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
    if (log?.transactionHash) {
      setCachedTransactionHash(fileHash, log.transactionHash);
      return log.transactionHash;
    }
    if (fromBlock === 0n || fromBlock === floorBlock) break;
    toBlock = fromBlock - 1n;
  }

  setCachedTransactionHash(fileHash, undefined);
  return undefined;
}

export function getCachedTransactionHash(fileHash: `0x${string}`) {
  return transactionHashCache.get(cacheKey(fileHash));
}

function setCachedTransactionHash(
  fileHash: `0x${string}`,
  transactionHash: string | undefined,
) {
  const key = cacheKey(fileHash);
  transactionHashCache.set(key, transactionHash);

  if (transactionHashCache.size > maxTransactionHashCacheEntries) {
    const firstKey = transactionHashCache.keys().next().value;
    if (firstKey) transactionHashCache.delete(firstKey);
  }
}

function cacheKey(fileHash: `0x${string}`) {
  return `${openProofContractAddress || "unconfigured"}:${fileHash.toLowerCase()}`;
}
