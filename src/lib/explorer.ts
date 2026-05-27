import { openProofChain } from "@/lib/contracts";

export function transactionExplorerUrl(hash: string) {
  return `${openProofChain.blockExplorers.default.url}/tx/${hash}`;
}

export function addressExplorerUrl(address: string) {
  return `${openProofChain.blockExplorers.default.url}/address/${address}`;
}
