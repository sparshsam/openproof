import { parseAbiItem, type PublicClient } from "viem";
import { openProofAbi, openProofContractAddress } from "@/lib/contracts";

export type OnchainProof = {
  creator: string;
  timestamp: string;
  fileHash: `0x${string}`;
  transactionHash?: string;
  blockNumber?: string;
};

export function isBytes32Hash(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(value);
}

type TxBlockResult =
  | { transactionHash: `0x${string}`; blockNumber: string }
  | undefined;

const txCache = new Map<string, TxBlockResult>();
const maxCacheEntries = 128;

function cacheKey(fileHash: `0x${string}`) {
  return `${openProofContractAddress || "unconfigured"}:${fileHash.toLowerCase()}`;
}

function getCached(fileHash: `0x${string}`): TxBlockResult {
  return txCache.get(cacheKey(fileHash));
}

function setCached(fileHash: `0x${string}`, value: TxBlockResult) {
  const key = cacheKey(fileHash);
  txCache.set(key, value);
  if (txCache.size > maxCacheEntries) {
    const first = txCache.keys().next().value;
    if (first) txCache.delete(first);
  }
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

  // Build base result from onchain read
  const result: OnchainProof = {
    creator: proof.creator,
    timestamp: new Date(Number(proof.timestamp) * 1000).toISOString(),
    fileHash: proof.fileHash,
  };

  // Try cached tx/block info first, then fetch if missing
  const cached = getCached(fileHash);
  if (cached) {
    result.transactionHash = cached.transactionHash;
    result.blockNumber = cached.blockNumber;
  } else {
    findProofTransactionHash(publicClient, fileHash).then((r) => {
      if (r) {
        result.transactionHash = r.transactionHash;
        result.blockNumber = r.blockNumber;
      }
    }).catch(() => {});
  }

  return result;
}

export async function findProofTransactionHash(
  publicClient: PublicClient,
  fileHash: `0x${string}`,
): Promise<TxBlockResult> {
  if (!openProofContractAddress) return undefined;

  const cached = getCached(fileHash);
  if (cached !== undefined) return cached;

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
      const result = {
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber?.toString() ?? "",
      };
      setCached(fileHash, result);
      return result;
    }
    if (fromBlock === 0n || fromBlock === floorBlock) break;
    toBlock = fromBlock - 1n;
  }

  setCached(fileHash, undefined);
  return undefined;
}
