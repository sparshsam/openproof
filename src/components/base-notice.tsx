import { Info } from "lucide-react";

export function BaseSepoliaNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-3xl border border-base-blue/20 bg-base-blue/10 p-4 text-sm text-muted ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent" />
      <p>
        This MVP uses Base Sepolia testnet. No real funds are required.
      </p>
    </div>
  );
}
