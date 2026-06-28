import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@fontsource-variable/stack-sans-notch";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { OfflineNotice } from "@/components/offline-notice";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proof.kovina.org"),
  title: {
    default: "OpenProof — Proof-of-Existence · File Fingerprinting · Blockchain Timestamping",
    template: "%s | OpenProof",
  },
  description:
    "Prove a file existed at a specific time — without uploading it. OpenProof is a privacy-first, open-source proof-of-existence tool. Hash a file locally with SHA-256, register the fingerprint on Base Sepolia, and verify independently. No uploads, no accounts, no backend. Used by developers, creators, researchers, and legal professionals for document integrity, digital evidence, and cryptographic timestamping.",
  keywords: [
    "OpenProof",
    "proof of existence",
    "file fingerprinting",
    "blockchain timestamping",
    "SHA-256 verification",
    "cryptographic proof",
    "document integrity",
    "digital evidence",
    "privacy-first",
    "Base Sepolia",
    "SHA-256",
    "cryptographic proof",
    "privacy-preserving verification",
    "file integrity verification",
    "timestamping service",
    "open source proof of existence",
    "web3",
    "Solidity",
    "wagmi",
  ],
  alternates: {
    canonical: "https://proof.kovina.org",
  },
  openGraph: {
    title: "OpenProof — Privacy-First Proof-of-Existence",
    description:
      "Prove a file existed without uploading it. Hash locally with SHA-256, timestamp the fingerprint on Base Sepolia, verify independently. No accounts, no backend, no tracking.",
    url: "https://proof.kovina.org",
    siteName: "OpenProof",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "OpenProof — privacy-first cryptographic proof-of-existence on Base Sepolia",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenProof — Proof-of-Existence · File Fingerprinting · Blockchain Timestamping",
    description:
      "Prove a file existed without uploading it. Hash locally with SHA-256, timestamp the fingerprint onchain, verify independently.",
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OpenProof",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0081CC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var t=localStorage.getItem('openproof-theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)})();
              if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
        <ThemeProvider>
          <AppShell>
            <ErrorBoundary>{children}</ErrorBoundary>
          </AppShell>
          <OfflineNotice />
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
