# @modules/brand

Shared **design tokens** for every service — one source of truth for the Modules
brand colours and type. Mirrors the brand spec in
[`services/bragi/docs/brand.md`](../../services/bragi/docs/brand.md).

## Use it in a service

1. Add the dependency (workspace):

   ```jsonc
   // services/<svc>/package.json
   "dependencies": { "@modules/brand": "workspace:*" }
   ```

2. Import the tokens **after** Tailwind in your entry CSS:

   ```css
   @import "tailwindcss";
   @import "@modules/brand/tokens.css";
   ```

   You now have `teal-600`, `amber-500`, `navy-900`, `violet-600`, the `font-display`
   / `font-data` helpers, and the `.bg-aurora` / `.bg-grid` textures — identical across
   every service.

3. Need the raw values in JS/TS (charts, canvas, emails)?

   ```ts
   import tokens from "@modules/brand/tokens.json";
   tokens.color.teal.primary; // "#0e7c7b"
   ```

## What's here

| File | For |
|---|---|
| `tokens.css` | Tailwind v4 `@theme` tokens + shared brand helpers |
| `tokens.json` | the same values as data, for JS/TS/tooling |

Logos and favicons live in the repo-root [`assets/brand/`](../../assets/brand/) (and
are copied into each service's `public/`). Keep both in sync when the brand changes:
edit tokens here, assets there.
