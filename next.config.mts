import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: { unoptimized: true },
};

export default nextConfig;
