import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@fontsource-variable/stack-sans-notch";
import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
        url: "/og.png",
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
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
