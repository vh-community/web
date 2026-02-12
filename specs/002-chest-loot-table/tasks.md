---

description: "Tasks for implementing Loot Table → Chests"
---

# Tasks: Loot Table - Chests

**Input**: Design documents from `specs/002-chest-loot-table/`
**Prerequisites**: `spec.md` (required), `plan.md` (required), `research.md`, `data-model.md`, `quickstart.md`

**Tests**: No automated test tasks are included because the feature spec does not explicitly request them.

## Format: `T### [P?] [US?] Description (with file path)`

- [P] = parallelizable (different files, no unmet dependencies)
- [US#] = user story label (required for story phases only)

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create feature folders `src/features/loot-tables/chests/` and `src/features/loot-tables/shared/`
- [X] T002 Create transformer folders `transformer/loot_tables/` and `transformer/bin/`
- [X] T003 Add transformer TypeScript config in `tsconfig.transformer.json`
- [X] T004 Add transformer entrypoint runner in `transformer/bin/generate-loot-tables.ts`
- [X] T005 Add build output ignore for `transformer/dist/` in `.gitignore`
- [X] T006 Add `generate:loot-tables` script in `package.json` that runs `tsc -p tsconfig.transformer.json` then `node transformer/dist/bin/generate-loot-tables.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Complete this phase before starting any user story implementation.

- [X] T007 Define published loot table types in `src/models/published_chest_loot_table.ts` (IndexEntry + ChestLootTable + LevelSegment)
- [X] T008 [P] Add typed JSON fetch helper in `src/features/loot-tables/shared/fetchJson.ts` (used for index + chest files)
- [X] T009 [P] Add number formatting helper in `src/features/loot-tables/shared/formatExpected.ts` (FR-006a)
- [X] T010 Add minimal dev sample index in `public/data/loot_tables/index.json` (FR-002)
- [X] T011 Add minimal dev sample chest data in `public/data/loot_tables/chest_sample.json` (FR-008, FR-017/FR-017a)
- [X] T012 Add empty/missing data UI block in `src/features/loot-tables/shared/EmptyState.tsx` (Edge Case: missing/empty index)
- [X] T012a Add loading status UI block in `src/features/loot-tables/shared/LoadingState.tsx` (FR-002a)
- [X] T012b Add error status UI block in `src/features/loot-tables/shared/ErrorState.tsx` (FR-002c)

**Checkpoint**: A `yarn dev` run can fetch the sample index + chest JSON.

---

## Phase 3: User Story 1 — View chest loot outcomes (Priority: P1) 🎯 MVP

**Goal**: Open Loot Table → Chests and see expected loot per X chests.

**Independent Test**:
- Navigate to the Chests page.
- Confirm it loads rows based on `public/data/loot_tables/index.json` + referenced chest files.
- Change Level and confirm a different level segment is selected (SC-002).

### Implementation

- [X] T013 [US1] Add navigation entry and route handling in `src/App.tsx` (FR-001)
- [X] T014 [P] [US1] Add page scaffold component in `src/features/loot-tables/chests/ChestsPage.tsx`
- [X] T015 [P] [US1] Add level clamp + segment selection helper in `src/features/loot-tables/chests/selectLevelSegment.ts` (FR-008)
- [X] T016 [US1] Implement index loading + per-chest file loading in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-002, FR-008)
- [X] T017 [P] [US1] Implement rarity-adjusted tier weight logic in `src/features/loot-tables/chests/rarity.ts` (FR-008b)
- [X] T018 [P] [US1] Implement quantity scaling rules in `src/features/loot-tables/chests/quantity.ts` (FR-008c)
- [X] T019 [P] [US1] Implement expected value math in `src/features/loot-tables/chests/expectedValue.ts` (FR-008a, FR-021, FR-022)
- [X] T020 [P] [US1] Implement grouping by item `id` with per-tier sub-row breakdown in `src/features/loot-tables/chests/aggregateByItemId.ts` (FR-019, FR-020)
- [X] T021 [P] [US1] Add settings controls UI in `src/features/loot-tables/chests/ChestsControls.tsx` (FR-004)
- [X] T022 [US1] Wire settings changes to recompute results in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-006, FR-007)
- [X] T023 [P] [US1] Add table component with grouped item rows + tier sub-rows and tier rarity visual treatment in `src/features/loot-tables/chests/ChestsTable.tsx` and `src/features/loot-tables/chests/tierStyles.ts` (FR-003, FR-003a, FR-020)
- [X] T023a [P] [US1] Enforce deterministic row ordering (index order for chests, item id ascending, tier order Common→Rare→Epic→Omega) in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-020a)
- [X] T024 [US1] Apply formatting (2 decimals, trim zeros) and ensure tier is indicated via text (not color alone) in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-006a, FR-003a)
- [X] T025 [US1] Handle zero total weight pools safely in `src/features/loot-tables/chests/expectedValue.ts` (Edge Case)
- [X] T026 [US1] Memoize derived computations to meet responsiveness criteria in `src/features/loot-tables/chests/ChestsPage.tsx` (SC-003/SC-003a/SC-003b)

---

## Phase 4: User Story 2 — Configure and persist settings (Priority: P2)

**Goal**: Settings persist across reloads and future sessions.

**Independent Test**:
- Change each setting.
- Reload.
- Confirm values are restored and results match (SC-004).

- [X] T027 [US2] Define storage schema + defaults in `src/features/loot-tables/chests/settingsStorage.ts` (FR-005)
- [X] T027a [US2] Use a single versioned `localStorage` key `vh.community.lootTables.chests.settings.v1` in `src/features/loot-tables/chests/settingsStorage.ts` (FR-005a)
- [X] T028 [US2] Add `useLootSettings` hook with persistence in `src/features/loot-tables/chests/useLootSettings.ts` (FR-005)
- [X] T029 [US2] Sync slider + text input for Per X chests in `src/features/loot-tables/chests/ChestsControls.tsx` (Story 2 scenario #2)
- [X] T030 [US2] Persist and restore all four settings in `src/features/loot-tables/chests/useLootSettings.ts` (Story 2 scenarios #1 and #3)
- [X] T031 [US2] Clamp or reject invalid inputs (range enforcement) in `src/features/loot-tables/chests/settingsStorage.ts` (FR-004)

---

## Phase 5: User Story 3 — Maintain published chest loot data (Priority: P3)

**Goal**: One repo command generates consolidated published chest files + index.

**Independent Test**:
- Run `yarn run generate:loot-tables`.
- Confirm `public/data/loot_tables/index.json` exists.
- Confirm `public/data/loot_tables/chest_*.json` exists.
- Confirm `_raw.json` sources are excluded (SC-006).

- [X] T032 [P] [US3] Define source loot table input types in `transformer/loot_tables/minecraftLootTable.ts`
- [X] T033 [US3] Implement source scan + filter in `transformer/loot_tables/chests.ts` (FR-009, FR-010)
- [X] T034 [US3] Implement threshold grouping + segment range derivation in `transformer/loot_tables/chests.ts` (FR-011, FR-012, FR-017, FR-017a)
- [X] T035 [US3] Implement transform to tiered segment model in `transformer/loot_tables/chests.ts` (FR-013, FR-014, FR-015, FR-019)
- [X] T036 [US3] Implement output writing for chest files in `transformer/loot_tables/chests.ts` (FR-016)
- [X] T037 [US3] Implement index generation in `transformer/loot_tables/chests.ts` (FR-018)
- [X] T038 [US3] Wire the CLI entrypoint to run the transform in `transformer/bin/generate-loot-tables.ts` (User Story 3)
- [X] T039 [US3] Update docs with the real command in `specs/002-chest-loot-table/quickstart.md` (SC-005)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T040 [P] Add accessible labels + keyboard focus handling in `src/features/loot-tables/chests/ChestsControls.tsx` (Constitution accessibility intent)
- [X] T041 Add explicit empty/error messaging in `src/features/loot-tables/chests/ChestsPage.tsx` (Edge Cases)
- [X] T041a Add explicit loading messaging in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-002a)
- [X] T041b Handle partial failures (some chest files fail) while still showing successful results in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-002c)
- [X] T042 [P] Add performance notes to `specs/002-chest-loot-table/quickstart.md` (SC-003/SC-003a/SC-003b)

---

## Dependencies & Execution Order

### Phase dependencies

- Setup (Phase 1) → Foundational (Phase 2) → User stories (Phases 3–5) → Polish

### User story dependencies

- US1 depends on Phase 2 sample data (or US3-generated data) to render anything.
- US2 depends on US1’s settings controls existing.
- US3 can be done after Phase 2 in parallel with US1/US2, but is required to meet SC-005/SC-006.

---

## Parallel execution examples

### US1

- T017 [P] [US1] `src/features/loot-tables/chests/rarity.ts`
- T018 [P] [US1] `src/features/loot-tables/chests/quantity.ts`
- T019 [P] [US1] `src/features/loot-tables/chests/expectedValue.ts`
- T021 [P] [US1] `src/features/loot-tables/chests/ChestsControls.tsx`
- T023 [P] [US1] `src/features/loot-tables/chests/ChestsTable.tsx`

### US3

- T032 [P] [US3] `transformer/loot_tables/minecraftLootTable.ts`
- T033 [US3]–T037 [US3] `transformer/loot_tables/chests.ts`

---

## Implementation strategy

### MVP scope

- Phase 1 + Phase 2 + Phase 3 (US1) using sample `public/data/loot_tables/` data.

### Incremental delivery

- Add US2 persistence.
- Add US3 generator command.
