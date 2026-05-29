import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenProof",
  description:
    "Cryptographic proof for files, built on Base Sepolia. Timestamp file fingerprints onchain without uploading the file anywhere.",
  openGraph: {
    title: "OpenProof",
    description:
      "Cryptographic proof for files, built on Base Sepolia. Timestamp file fingerprints onchain without uploading the file anywhere.",
    url: "https://openproof.vercel.app",
    siteName: "OpenProof",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenProof",
    description:
      "Cryptographic proof for files, built on Base Sepolia. Timestamp file fingerprints onchain without uploading the file anywhere.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
