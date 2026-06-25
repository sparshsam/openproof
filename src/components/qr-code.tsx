"use client";

import QRCode from "qrcode";
import { Download, Link2, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActionPill } from "@/components/design-system";

export function ProofQrCode({ url, label }: { url: string; label?: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(url, {
      color: { dark: "#050b18", light: "#ffffff" },
      errorCorrectionLevel: "M", margin: 2, width: 320,
    }).then(setDataUrl).catch(() => setDataUrl(""));
  }, [url]);

  // Generate a high-res QR for print/download
  const [highResQr, setHighResQr] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(url, {
      color: { dark: "#050b18", light: "#ffffff" },
      errorCorrectionLevel: "Q", margin: 2, width: 800,
    }).then(setHighResQr).catch(() => {});
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

  function downloadHighResQr() {
    if (!highResQr) return;
    const link = document.createElement("a");
    link.href = highResQr;
    link.download = "openproof-verification-qr-high.png";
    link.click();
  }

  return (
    <div ref={qrRef} className="rounded-2xl bg-bg-surface-muted p-5 sm:p-6 space-y-5">
      {label ? (
        <p className="text-xs font-bold tracking-wider uppercase text-accent">{label}</p>
      ) : null}
      <div className="rounded-xl bg-white p-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="QR code for OpenProof verification" className="mx-auto size-44 sm:size-52" src={dataUrl} />
        ) : (
          <div className="mx-auto grid size-44 place-items-center rounded-xl bg-bg-surface-muted text-sm text-text-muted sm:size-52">
            Generating QR...
          </div>
        )}
      </div>
      <p className="break-all font-mono text-xs text-text-muted">{url}</p>
      <div className="flex flex-wrap gap-3">
        <ActionPill variant="secondary" onClick={copyLink}>
          <Link2 className="size-4" />
          {copied ? "Copied" : "Copy link"}
        </ActionPill>
        <ActionPill variant="secondary" onClick={downloadQr}>
          <Download className="size-4" />
          QR (standard)
        </ActionPill>
        <ActionPill disabled={!highResQr} variant="secondary" onClick={downloadHighResQr}>
          <Smartphone className="size-4" />
          QR (high res)
        </ActionPill>
      </div>
    </div>
  );
}
