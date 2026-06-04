export const genericRpcErrorMessage =
  "OpenProof could not reach the Base Sepolia registry. Please try again in a moment.";

export const genericWalletErrorMessage =
  "The wallet action could not be completed. Please review your wallet and try again.";

export function normalizeClientError(
  error: unknown,
  fallback = genericRpcErrorMessage,
) {
  if (error instanceof Error && error.name === "AbortError") {
    return "The request timed out. Please try again.";
  }

  return fallback;
}

