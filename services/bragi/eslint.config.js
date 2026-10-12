// Flat config (ESLint v9+). Lints TS/TSX/Astro for the bragi website.
// Run via `mise run lint bragi` (nx → `eslint src`).
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default tseslint.config(
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  // Tell ESLint which extensions to pick up when scanning a directory (`eslint src`).
  { files: ["**/*.{js,mjs,cjs,ts,tsx,astro}"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
);
