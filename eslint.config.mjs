import { globalIgnores, defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["hardhat.config.js", "scripts/**/*.js", "scripts/**/*.cjs", "test/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // Static export uses <img> for local SVGs/PNGs — <Image> not needed
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "typechain-types/**",
    "next-env.d.ts",
    // Android native project — not source code
    "android/**",
  ]),
]);

export default eslintConfig;
