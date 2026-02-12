# Research: Chests Cleanup

This document resolves remaining implementation decisions for `003-chests-cleanup`.

## Decision 1: Run transformer from TypeScript source (FR-001)

- **Decision**: Use `tsx` to run transformer entrypoints directly (no `transformer/dist` output committed).
- **Rationale**:
	- ESM-friendly and low-friction in modern TS repos.
	- Debugging is simpler (source maps; no “compiled JS” mismatch).
	- Minimal tooling impact (one small dev dependency).
- **Implementation shape**:
	- Add devDependency: `tsx`.
	- Update script to something equivalent to:
		- `generate:loot-tables`: `tsx --tsconfig tsconfig.transformer.json transformer/bin/generate-loot-tables.ts`
	- Keep CI/type safety by optionally adding:
		- `typecheck:transformer`: `tsc -p tsconfig.transformer.json --noEmit`
- **Alternatives considered**:
	- `ts-node` (ESM loader): more configuration/edge cases and slower startup.
	- Bun: great DX but changes runtime assumptions.
	- Node experimental TS/strip-types: shifting behavior; not ideal for a stable workflow.

## Decision 2: Canonical JSON model is TypeScript in `src/models/` (FR-002, FR-002a)

- **Decision**: The generator and UI share the same model definitions by importing:
	- `/home/senth/git/vh-community-web/src/models/tieredLootTable.ts`
	- `/home/senth/git/vh-community-web/src/models/jsonIndex.ts`
- **Rationale**:
	- Removes “published” type duplication in transformer.
	- Reduces drift risk and eliminates missing-type issues.
- **Alternatives considered**:
	- Duplicated transformer types (prior approach): easy to drift.
	- OpenAPI as canonical: explicitly out of scope (FR-003a).

## Decision 3: Static JSON “contracts” (FR-003a)

- **Decision**: Do not maintain OpenAPI. Document contracts as:
	- Canonical TypeScript types in `src/models/`
	- Optional JSON Schemas under `specs/003-chests-cleanup/contracts/` for human readability.
- **Rationale**:
	- Matches the spec’s explicit “no OpenAPI” requirement.
	- Keeps tooling minimal and avoids contract-test infrastructure.
- **Alternatives considered**:
	- Full JSON Schema + Ajv validation: viable, but adds more moving parts.
	- Runtime validation (Zod/Valibot): good boundary safety, but introduces runtime dependency.

## Decision 4: Chest file naming and exclusion rules (FR-003, FR-003b, FR-013)

- **Decision**: Generated file names use a concise chest key derived from the chest id:
	- If chest id ends with `_chest`, remove that trailing suffix only.
	- Prefix output with `chest_` and suffix `.json`.
	- Example: `gilded_chest` → `chest_gilded.json`; `wooden_chest` → `chest_wooden.json`.
- **Treasure chest**:
	- Exclude at generation time by skipping chest ids matching `treasure_chest`.
	- Result: no `index.json` entry and no chest file.
- **Alternatives considered**:
	- Hide via UI filter: rejected; spec requires it is not generated.
	- Remove `chest` substring anywhere: rejected; spec requires trailing-suffix-only behavior.

## Decision 5: Page-based UI organization (FR-004, FR-005, FR-006, FR-007)

- **Decision**: Move UI code to page-based structure:
	- `src/pages/loot-tables/chests/` for Chests page and its logic
	- `src/pages/loot-tables/` for loot-table shared helpers/components
	- `src/components/` for sitewide layout components: `Header`, `Navigation`, `Footer`
- **Rationale**:
	- Page ownership is clearer; shared helpers become intentionally shared.
	- Prevents “feature folder” sprawl as more pages are added.
- **Alternatives considered**:
	- Keep `src/features/...`: rejected by FR-004/FR-005.

## Decision 6: Sorting, search, and friendly labels (FR-009..FR-014)

- **Chest ordering**:
	- Primary sort by category order: Wooden, Living, Gilded, Ornate, Hardened, Flesh, Enigma.
	- Secondary sort (unknown categories): stable alphabetical by chest id.
- **Search**:
	- Single text input filters chest sections.
	- Query matches either the chest id (e.g. `gilded_chest`) or the derived display label.
- **Friendly item labels**:
	- Derive display name from item id:
		- Strip namespace prefix before `:` when present
		- Split on `_`
		- Title-case words
	- Example: `minecraft:diamond_sword` → `Diamond Sword`; `diamond_sword` → `Diamond Sword`.
