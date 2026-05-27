import { Info } from "lucide-react";

export function BaseSepoliaNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-lg border border-border bg-surface-muted p-4 text-sm text-muted ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent" />
      <p>
        This MVP uses Base Sepolia testnet. No real funds are required.
      </p>
    </div>
  );
}
