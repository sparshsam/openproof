export const baseSepoliaExplorerUrl = "https://sepolia.basescan.org";

export function transactionExplorerUrl(hash: string) {
  return `${baseSepoliaExplorerUrl}/tx/${hash}`;
}

export function addressExplorerUrl(address: string) {
  return `${baseSepoliaExplorerUrl}/address/${address}`;
}
