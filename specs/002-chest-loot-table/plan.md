# Implementation Plan: Loot Table - Chests

**Branch**: `002-chest-loot-table` | **Date**: 2026-02-11 | **Spec**: specs/002-chest-loot-table/spec.md
**Input**: Feature specification from specs/002-chest-loot-table/spec.md (single source of truth)

## Summary

Deliver a new **Loot Table → Chests** view that loads published chest loot JSON from `public/data/loot_tables/`, computes deterministic expected values under Level + Item Rarity + Item Quantity modifiers, and persists user settings locally. Provide a repo command that transforms VH loot tables from `the_vault/gen/1.0/loot_tables/` into the published tiered segment model plus an index. The UI also applies tier rarity visual treatment (FR-003a) using translucent backgrounds for item identity and per-tier breakdown values.

## Technical Context

**Language/Version**: TypeScript (~5.7), React (~19), Vite (~6)  
**Primary Dependencies**: React, Vite, Tailwind CSS, Biome  
**Storage**: Static JSON in `public/` + browser `localStorage` for settings  
**Testing**: Add minimal unit tests for data mapping and expectation math (Vitest suggested)  
**Target Platform**: Modern browsers (Vite SPA)  
**Project Type**: Single-page web app  
**Performance Goals**: Recompute + re-render within 0.5s on setting changes (SC-003/003a/003b)  
**Constraints**: Deterministic analytic expected values only (FR-008a); minimal tooling additions  
**Scale/Scope**: Potentially many rows across multiple chests; must remain responsive

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Content & Accessibility: Use semantic headings, labeled inputs, keyboard-focus styles; avoid color-only meaning.
- Minimal Tooling: Prefer lightweight in-repo transformer + small UI utilities; avoid heavy routing libraries unless needed.
- Performance: Use memoization/derived state; avoid recomputing across unchanged inputs.
- Quality Gates: Ensure `yarn lint`, `yarn run build` pass; if unit tests are added, include `yarn test` and keep tests colocated.
- Data hygiene: Do not introduce raw extracted configs into git; transformer reads from existing `the_vault/` tree and writes derived artifacts under `public/`.

Status: PASS (no constitution violations required by this plan).

## Project Structure

### Documentation (this feature)

```text
specs/002-chest-loot-table/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── App.tsx
├── main.tsx
├── models/
│   ├── tiered_loot_table.ts              # existing baseline model
│   └── published_chest_loot_table.ts     # new: published chest + index shapes
├── features/
│   └── loot-tables/
│       ├── chests/
│       │   ├── ChestsPage.tsx
│       │   ├── settings.ts               # localStorage read/write + defaults
│       │   └── expectedValue.ts          # FR-008a..FR-022 math
│       └── shared/
│           └── fetchJson.ts

transformer/
└── loot_tables/
    ├── chests.ts                         # scan + consolidate + publish
    ├── minecraftLootTable.ts             # parse source VH loot table format
    └── chests.test.ts                    # unit tests (mapping correctness)

public/
└── data/
    └── loot_tables/
        ├── index.json
        └── chest_*.json
```

**Structure Decision**: Add a `transformer/` folder (per constitution) for generation scripts and keep UI logic under `src/features/loot-tables/` to isolate calculation + settings.

## Implementation Phases & Tasks (Traceable)

### Phase 0 — Research (from spec; no spec changes)

Goal: Lock down implementation choices that are allowed by the spec but not explicitly fixed (so engineering can proceed without rewriting spec).

- Decide routing approach: implement minimal hash-based routing in `App.tsx` (no extra dependency) to satisfy **FR-001**.
- Decide Level out-of-range behavior: clamp Level into `[0,100]` (allowed by Edge Cases).
- Decide how to provide “human-readable label”: show `id` as label unless a mapping exists (FR-003).
- Decide label fallbacks: chest label uses index `name` when present, else `id`; item label uses item `id` only (FR-003b).
- Decide deterministic ordering: chests follow index order; items sorted by item id; tier sub-rows fixed order Common→Rare→Epic→Omega (FR-020a).

Deliverable: specs/002-chest-loot-table/research.md

### Phase 1 — Design & Contracts

Goal: Define stable published JSON contracts and internal TypeScript types.

1) Published data contracts (maps to FR-002, FR-008, FR-013..FR-018)
   - Define `index.json` entry shape `{ id, type, name?, file, show }`.
   - Define `chest_*.json` as `{ id, levels: LevelSegment[] }` where each segment contains:
     - `minLevel`, `maxLevel` (inclusive)
     - `roll: { min, max }`
     - `common|rare|epic|omega: { weight, items: { id, weight, count: { min, max } }[] }`
   - Document `*_raw.json` exclusion.

2) OpenAPI contract (maps to FR-002/FR-008)
   - Add `contracts/openapi.yaml` with `GET /data/loot_tables/index.json` and `GET /data/loot_tables/{file}`.

3) TypeScript models (maps to FR-013..FR-017a)
   - Add `src/models/published_chest_loot_table.ts` for published types used by UI and tests.

Deliverables: specs/002-chest-loot-table/data-model.md, specs/002-chest-loot-table/contracts/openapi.yaml

### Phase 2 — Implementation Plan (what to build)

#### A) Transformer: publish chest loot data

Implements User Story 3 and FR-009..FR-018, SC-005/SC-006.

- A1. Source scanning and filtering
  - Scan `the_vault/gen/1.0/loot_tables/` for files whose name contains `chest` (FR-009).
  - Exclude any ending with `_raw.json` (FR-010).

- A2. Consolidation by threshold
  - Group files by base chest id (e.g., `gilded_chest_0`, `_20`, `_50` → `gilded_chest`) (FR-011).
  - Parse numeric suffix as `minLevel` (FR-012).
  - Build segments so each threshold applies to `[minLevel,nextMinLevel-1]`, last to `100` (FR-012).

- A3. Transform to tiered segment model
  - Parse each loot table JSON:
    - `roll` uniform range → segment `roll.min/max` (FR-014).
    - Top-level `pool` entries (weight + item list) → tier weights + items (FR-015).
    - Item `count` uniform range → `count.min/max` (FR-014).
  - Preserve duplicate item ids (FR-019).

- A4. Output
  - Write one file per chest type: `public/data/loot_tables/chest_{id}.json` (FR-016).
  - Write index: `public/data/loot_tables/index.json` with stable ids + file paths and show flags (FR-018).
  - Add a single repo command (package script) to run this generation (User Story 3).

- A5. Unit tests (constitution mapping rule)
  - Add mapping tests for:
    - consolidation ranges for representative chest sets (FR-012)
    - raw exclusion (FR-010)
    - parsing roll/count ranges and tier/item weights (FR-014/FR-015)

Acceptance mapping:
- Story 3 scenario #1 → A1–A4
- Story 3 scenario #2 → A1/A4

#### B) UI: Chests page + navigation

Implements User Story 1 and FR-001..FR-008, SC-001..SC-004.

- B1. Navigation entry (FR-001)
  - Add a header/menu area with a “Loot Table” section and a “Chests” entry.
  - Use a minimal hash route (e.g., `#/loot-table/chests`) to avoid new deps.

- B2. Data loading (FR-002, FR-008)
  - Fetch `public/data/loot_tables/index.json`.
  - For each entry with `show: true`, fetch its chest file and select the segment matching Level.
  - Show a loading status while fetches are in-flight (FR-002a).
  - Handle missing/empty index with a no-data message while leaving controls usable (FR-002b).
  - Handle index/chest fetch failures with explicit messaging and partial results (FR-002c).

- B3. Settings UI + persistence (FR-004, FR-005)
  - Controls:
    - Per X chests slider + numeric input, synced (FR-004, Story 2 scenario #2)
    - Level integer input 0–100 (clamp) (FR-004, Edge Case)
    - Item Rarity and Item Quantity percent inputs 0–300 (FR-004)
  - Store to `localStorage` on change; read defaults on load using a single versioned key (FR-005/FR-005a, Story 2 scenario #1/#3, SC-004).

- B4. Expected value computation (FR-006..FR-008c, FR-021, FR-022)
  - For the selected level segment:
    - Apply rarity multiplier $m_r = 1 + r/100$ to tier weights (rare/epic/omega) (FR-008b)
    - Compute $P(pool)$ from effective weights (FR-008b)
    - Apply quantity multiplier $m_q = 1 + q/100$:
      - scale roll bounds via floor and cap at 54 (FR-008c)
      - scale count bounds via floor (FR-008c)
    - Compute expectations using $(min+max)/2$ for uniform integer ranges (FR-021)
    - Compute per-item expectation per chest using FR-022 and sum duplicates by id (FR-020)
  - Multiply by X chests (FR-006).
  - Format to 2 decimals, trim zeros (FR-006a).

- B5. Table rendering (FR-003)
  - Render rows grouped by item id (FR-020) and show chest type, item id/label, expected per X.
  - Use deterministic ordering for chest sections, items, and tiers (FR-020a).
  - Apply tier rarity visual treatment (FR-003a):
    - Item identity (icon + name) uses the **lowest** tier the item appears in for its translucent background.
    - Per-tier breakdown values use the tier-specific translucent background for that tier.
    - Implement using existing Tailwind utility classes/tokens with opacity (no hard-coded colors).
    - Ensure the tier is also conveyed via text in the tier breakdown (do not rely on color alone).
  - Keep updates responsive (SC-003/003a/003b) by memoizing derived computations.

Acceptance mapping:
- Story 1 scenario #1 → B1/B2/B5
- Story 1 scenario #2 → B2 (segment selection) + B4
- Story 1 scenario #3 → B3/B4
- Story 2 scenarios → B3

#### C) Verification checklist (local)

Quality gates (constitution):
- `yarn lint`
- `yarn run build`
- If unit tests added: `yarn test`

Behavior checks (maps to SC-001..SC-006):
- Navigate to Loot Table → Chests and see rows (SC-001).
- Change Level and confirm different segment applies for a chest with thresholds (SC-002).
- Change X/rarity/quantity and observe results update quickly (SC-003/003a/003b).
- Reload and confirm settings restored (SC-004).
- Run transformer command and confirm outputs generated and `_raw` excluded (SC-005/SC-006).

## Risks & Mitigations

- Source loot table format variants: parse defensively; fail-fast with clear errors; cover with unit tests.
- Performance with many rows: compute per chest file once per settings change; aggregate via maps.

## Out of Scope

- Simulation/Monte Carlo (explicitly disallowed by FR-008a).
- Advanced routing, pagination, filtering, or extra pages beyond “Loot Table → Chests”.

