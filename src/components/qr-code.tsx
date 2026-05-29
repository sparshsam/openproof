"use client";

import QRCode from "qrcode";
import { Download, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/design-system";

export function ProofQrCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      color: { dark: "#050b18", light: "#ffffff" },
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [url]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function downloadQr() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "openproof-verification-qr.png";
    link.click();
  }

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-surface-muted p-5">
      <div className="rounded-3xl bg-white p-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="QR code for OpenProof verification page"
            className="mx-auto size-48"
            src={dataUrl}
          />
        ) : (
          <div className="grid size-48 place-items-center rounded-3xl bg-surface-muted text-sm text-muted">
            Generating QR...
          </div>
        )}
      </div>
      <p className="break-all font-mono text-xs text-muted">{url}</p>
      <div className="flex flex-wrap gap-2">
        <ActionButton variant="secondary" onClick={copyLink}>
          <Link2 className="size-4" />
          {copied ? "Copied" : "Copy verification link"}
        </ActionButton>
        <ActionButton disabled={!dataUrl} variant="secondary" onClick={downloadQr}>
          <Download className="size-4" />
          Download QR PNG
        </ActionButton>
      </div>
    </div>
  );
}

