import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@fontsource-variable/stack-sans-notch";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openproof.vercel.app"),
  title: {
    default: "OpenProof",
    template: "%s | OpenProof",
  },
  description:
    "Open-source cryptographic proof infrastructure built on Base Sepolia. Timestamp file fingerprints onchain without uploading files anywhere.",
  keywords: [
    "OpenProof",
    "proof of existence",
    "Base Sepolia",
    "SHA-256",
    "cryptographic proof",
    "privacy-first",
    "web3",
    "Solidity",
    "wagmi",
  ],
  alternates: {
    canonical: "https://openproof.vercel.app",
  },
  openGraph: {
    title: "OpenProof",
    description:
      "Open-source cryptographic proof infrastructure built on Base Sepolia. Timestamp file fingerprints onchain without uploading files anywhere.",
    url: "https://openproof.vercel.app",
    siteName: "OpenProof",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "OpenProof cryptographic proof infrastructure built on Base",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenProof",
    description:
      "Open-source cryptographic proof infrastructure built on Base Sepolia. Timestamp file fingerprints onchain without uploading files anywhere.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
