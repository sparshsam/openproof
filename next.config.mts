import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  // Static export when building for Capacitor/Electron native platforms
  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "export" : undefined,
  images: { unoptimized: true },
  // Improve production build output
  productionBrowserSourceMaps: false,
  // Bundle analysis data available on CI
  // Optimize performance
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Strict experimental options for production quality
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@rainbow-me/rainbowkit",
    ],
  },
  // Security headers set via vercel.json for full CSP control
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
