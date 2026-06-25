// ── Error messages and recovery helpers ──

export const genericRpcErrorMessage =
  "OpenProof could not reach the registry. Please try again in a moment.";

export const genericWalletErrorMessage =
  "The wallet action could not be completed. Please review your wallet and try again.";

export const genericChainErrorMessage =
  "The transaction was submitted on the wrong network. Please switch to the supported chain and try again.";

export function normalizeClientError(
  error: unknown,
  fallback = genericRpcErrorMessage,
) {
  if (error instanceof Error && error.name === "AbortError") {
    return "The request timed out. Please try again.";
  }

  // Detect user rejection in wallet
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("user rejected") ||
      msg.includes("user denied") ||
      msg.includes("rejected by user") ||
      msg.includes("declined")
    ) {
      return "Transaction cancelled in wallet.";
    }
    if (
      msg.includes("insufficient funds") ||
      msg.includes("not enough") ||
      msg.includes("insufficient balance")
    ) {
      return "Insufficient funds for this transaction.";
    }
    if (
      msg.includes("chain") &&
      (msg.includes("mismatch") || msg.includes("wrong") || msg.includes("invalid"))
    ) {
      return genericChainErrorMessage;
    }
    if (msg.includes("nonce") && msg.includes("high")) {
      return "Nonce too high. Try resetting your wallet activity.";
    }
    if (msg.includes("nonce") && msg.includes("low")) {
      return "Nonce too low. A pending transaction may need to be cleared.";
    }
  }

  return fallback;
}
