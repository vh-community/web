# Copilot instructions (vh-community-web)

## What this repo is
- Vite + React (TS) static site that serves community resources, currently focused on interactive Vault Hunters loot tables.
- Loot table UI consumes **published JSON** under `public/data/loot_tables/` that is generated from the upstream VH data snapshot in `the_vault/`.

## Key structure (follow these patterns)
- UI entry + routing: `src/App.tsx` uses simple **hash routing** (no react-router). Add new pages by extending the `Route` union + `getRoute()`.
- JSON/domain types for published data live in `src/models/*` (notably `src/models/published_chest_loot_table.ts`).
- Pages are under `src/pages/` with components under each page folder.

## Data flow (loot tables)
- Generator: `yarn generate:loot-tables` compiles/runs `transformer/bin/generate-loot-tables.ts`.
- Source → output: reads `the_vault/gen/1.0/loot_tables/` and writes `public/data/loot_tables/index.json` + `public/data/loot_tables/chest_*.json`.
- UI loads data in `src/loot-tables/chests/ChestsPage.tsx` via `fetchJson<T>()` from `src/loot-tables/shared/fetchJson.ts`.

## Commands (use Yarn; `yarn.lock` is present)
- Dev server: `yarn dev`
- Production build: `yarn build` (runs `tsc -b` then `vite build`)
- Preview build: `yarn preview`
- Generate data: `yarn generate:loot-tables`
- Lint/format (Biome): `yarn lint`, `yarn format`, `yarn fix`

## Repo-specific conventions
- Formatting is enforced by Biome; indentation is **tabs** in TS/TSX (see `biome.json`). Prefer double quotes and trailing commas.
- Tailwind CSS is integrated via `@tailwindcss/vite` and `@import "tailwindcss";` in `src/index.css` (no Tailwind config file).
- Settings persistence uses versioned localStorage keys; for chests: `vh.community.lootTables.chests.settings.v1` in `src/loot-tables/chests/settingsStorage.ts`.
