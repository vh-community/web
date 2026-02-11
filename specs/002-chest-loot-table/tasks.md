---

description: "Tasks for implementing Loot Table → Chests"
---

# Tasks: Loot Table - Chests

**Input**: Design documents from `specs/002-chest-loot-table/`
**Prerequisites**: `spec.md` (required), `plan.md` (required), `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: No automated test tasks are included because the feature spec does not explicitly request them.

## Format: `T### [P?] [US?] Description (with file path)`

- [P] = parallelizable (different files, no unmet dependencies)
- [US#] = user story label (required for story phases only)

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create feature folders `src/features/loot-tables/chests/` and `src/features/loot-tables/shared/`
- [ ] T002 Create transformer folders `transformer/loot_tables/` and `transformer/bin/`
- [ ] T003 Add transformer TypeScript config in `transformer/tsconfig.json`
- [ ] T004 Add transformer entrypoint runner in `transformer/bin/generate-loot-tables.ts`
- [ ] T005 Add build output ignore for `transformer/dist/` in `.gitignore`
- [ ] T006 Add `generate:loot-tables` script in `package.json` that runs `tsc -p transformer/tsconfig.json` then `node transformer/dist/bin/generate-loot-tables.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: Complete this phase before starting any user story implementation.

- [ ] T007 Define published loot table types in `src/models/published_chest_loot_table.ts` (IndexEntry + ChestLootTable + LevelSegment)
- [ ] T008 [P] Add typed JSON fetch helper in `src/features/loot-tables/shared/fetchJson.ts` (used for index + chest files)
- [ ] T009 [P] Add number formatting helper in `src/features/loot-tables/shared/formatExpected.ts` (FR-006a)
- [ ] T010 Add minimal dev sample index in `public/data/loot_tables/index.json` (FR-002)
- [ ] T011 Add minimal dev sample chest data in `public/data/loot_tables/chest_sample.json` (FR-008, FR-017/FR-017a)
- [ ] T012 Add empty/missing data UI block in `src/features/loot-tables/shared/EmptyState.tsx` (Edge Case: missing/empty index)

**Checkpoint**: A `yarn dev` run can fetch the sample index + chest JSON.

---

## Phase 3: User Story 1 — View chest loot outcomes (Priority: P1) 🎯 MVP

**Goal**: Open Loot Table → Chests and see expected loot per X chests.

**Independent Test**:
- Navigate to the Chests page.
- Confirm it loads rows based on `public/data/loot_tables/index.json` + referenced chest files.
- Change Level and confirm a different level segment is selected (SC-002).

### Implementation

- [ ] T013 [US1] Add navigation entry and route handling in `src/App.tsx` (FR-001)
- [ ] T014 [P] [US1] Add page scaffold component in `src/features/loot-tables/chests/ChestsPage.tsx`
- [ ] T015 [P] [US1] Add level clamp + segment selection helper in `src/features/loot-tables/chests/selectLevelSegment.ts` (FR-008)
- [ ] T016 [US1] Implement index loading + per-chest file loading in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-002, FR-008)
- [ ] T017 [P] [US1] Implement rarity-adjusted tier weight logic in `src/features/loot-tables/chests/rarity.ts` (FR-008b)
- [ ] T018 [P] [US1] Implement quantity scaling rules in `src/features/loot-tables/chests/quantity.ts` (FR-008c)
- [ ] T019 [P] [US1] Implement expected value math in `src/features/loot-tables/chests/expectedValue.ts` (FR-008a, FR-021, FR-022)
- [ ] T020 [P] [US1] Implement duplicate item id aggregation in `src/features/loot-tables/chests/aggregateByItemId.ts` (FR-019, FR-020)
- [ ] T021 [P] [US1] Add settings controls UI in `src/features/loot-tables/chests/ChestsControls.tsx` (FR-004)
- [ ] T022 [US1] Wire settings changes to recompute results in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-006, FR-007)
- [ ] T023 [P] [US1] Add table component in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-003)
- [ ] T024 [US1] Apply formatting (2 decimals, trim zeros) to displayed amounts in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-006a)
- [ ] T025 [US1] Handle zero total weight pools safely in `src/features/loot-tables/chests/expectedValue.ts` (Edge Case)
- [ ] T026 [US1] Memoize derived computations to meet responsiveness criteria in `src/features/loot-tables/chests/ChestsPage.tsx` (SC-003/SC-003a/SC-003b)

---

## Phase 4: User Story 2 — Configure and persist settings (Priority: P2)

**Goal**: Settings persist across reloads and future sessions.

**Independent Test**:
- Change each setting.
- Reload.
- Confirm values are restored and results match (SC-004).

- [ ] T027 [US2] Define storage schema + defaults in `src/features/loot-tables/chests/settingsStorage.ts` (FR-005)
- [ ] T028 [US2] Add `useLootSettings` hook with persistence in `src/features/loot-tables/chests/useLootSettings.ts` (FR-005)
- [ ] T029 [US2] Sync slider + text input for Per X chests in `src/features/loot-tables/chests/ChestsControls.tsx` (Story 2 scenario #2)
- [ ] T030 [US2] Persist and restore all four settings in `src/features/loot-tables/chests/useLootSettings.ts` (Story 2 scenarios #1 and #3)
- [ ] T031 [US2] Clamp or reject invalid inputs (range enforcement) in `src/features/loot-tables/chests/settingsStorage.ts` (FR-004)

---

## Phase 5: User Story 3 — Maintain published chest loot data (Priority: P3)

**Goal**: One repo command generates consolidated published chest files + index.

**Independent Test**:
- Run `yarn run generate:loot-tables`.
- Confirm `public/data/loot_tables/index.json` exists.
- Confirm `public/data/loot_tables/chest_*.json` exists.
- Confirm `_raw.json` sources are excluded (SC-006).

- [ ] T032 [P] [US3] Define source loot table input types in `transformer/loot_tables/minecraftLootTable.ts`
- [ ] T033 [US3] Implement source scan + filter in `transformer/loot_tables/chests.ts` (FR-009, FR-010)
- [ ] T034 [US3] Implement threshold grouping + segment range derivation in `transformer/loot_tables/chests.ts` (FR-011, FR-012, FR-017, FR-017a)
- [ ] T035 [US3] Implement transform to tiered segment model in `transformer/loot_tables/chests.ts` (FR-013, FR-014, FR-015, FR-019)
- [ ] T036 [US3] Implement output writing for chest files in `transformer/loot_tables/chests.ts` (FR-016)
- [ ] T037 [US3] Implement index generation in `transformer/loot_tables/chests.ts` (FR-018)
- [ ] T038 [US3] Wire the CLI entrypoint to run the transform in `transformer/bin/generate-loot-tables.ts` (User Story 3)
- [ ] T039 [US3] Update docs with the real command in `specs/002-chest-loot-table/quickstart.md` (SC-005)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T040 [P] Add accessible labels + keyboard focus handling in `src/features/loot-tables/chests/ChestsControls.tsx` (Constitution accessibility intent)
- [ ] T041 Add explicit empty/error messaging in `src/features/loot-tables/chests/ChestsPage.tsx` (Edge Cases)
- [ ] T042 [P] Add performance notes to `specs/002-chest-loot-table/quickstart.md` (SC-003/SC-003a/SC-003b)

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
