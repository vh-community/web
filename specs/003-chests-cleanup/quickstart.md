# Quickstart: Chests Cleanup

## Prerequisites

- Node.js 18+ (recommend Node 20 LTS)
- Yarn
- A local Vault Hunters loot-table snapshot under:
	- `/home/senth/git/vh-community-web/the_vault/gen/1.0/loot_tables/`

Note: `the_vault/` is local input and must not be committed.

## Run the site

- Dev server: `yarn dev`
- Open:
	- Home: `#/`
	- Chests: `#/loot-table/chests`

## Generate loot tables

- Generate published JSON (runs from TypeScript source via `tsx`, no build step):
	- `yarn generate:loot-tables`
- Type-check transformer code only (no emit):
	- `yarn typecheck:transformer`

Expected outputs:
- Index: `/home/senth/git/vh-community-web/public/data/loot_tables/index.json`
- Per-chest files:
	- `/home/senth/git/vh-community-web/public/data/loot_tables/chest_*.json`

Generation rules:
- Treasure chest is excluded entirely (no index entry and no file).
- Chest filenames are concise: remove a trailing `_chest` suffix from the chest id before writing the file name.
- Index entries are ordered: Wooden → Living → Gilded → Ornate → Hardened → Flesh → Enigma (then unknown types alphabetically).

Note: `transformer/dist/` is not used. The generator runs directly from TypeScript source. Ensure `transformer/dist/` is not committed (it is in `.gitignore`).

## Quality gates

- Lint/format: `yarn lint` / `yarn format`
- Production build: `yarn build`
