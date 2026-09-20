import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The OpenNext Cloudflare bundle. Gitignored, but it is real generated
    // JavaScript on disk after `npm run preview`/`deploy`, and without this
    // `npm run lint` reports thousands of problems in vendored code the moment
    // anyone has built for Workers.
    ".open-next/**",
    // Wrangler's scratch bundles, written during `wrangler dev`.
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
