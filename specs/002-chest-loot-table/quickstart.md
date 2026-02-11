# Quickstart — Loot Table → Chests

This quickstart is scoped to specs/002-chest-loot-table/spec.md.

## Prereqs

- Node.js (modern LTS recommended)
- Yarn (repo uses yarn.lock)

## Install

- `yarn`

## Generate published chest loot tables

The feature requires derived JSON in `public/data/loot_tables/`.

Planned command (to be added by implementation):

- `yarn run generate:loot-tables`

This compiles the transformer TypeScript and runs the generator. Source loot tables are read from `the_vault/gen/1.0/loot_tables/` and output to `public/data/loot_tables/`.

Expected outputs:

- `public/data/loot_tables/index.json`
- `public/data/loot_tables/chest_*.json`

## Run locally

- `yarn dev`

Then open the site and navigate to **Loot Table → Chests**.

## Verify

- Change Level / Item Rarity / Item Quantity and confirm values change.
- Reload page and confirm settings persist.
- Re-run generation and confirm `_raw.json` sources are excluded.

## Performance Notes

- Expected value computations are memoized via `useMemo` in `ChestsPage.tsx` (SC-003/003a/003b).
- Recomputation is triggered only when settings change, not on every render.
- The target is recompute + re-render within 0.5s on a modern desktop browser for up to 50 chests and 5,000 grouped item rows (SC-003c).

## Build

- `yarn run build`

## Lint/format

- `yarn lint`
- `yarn format`
