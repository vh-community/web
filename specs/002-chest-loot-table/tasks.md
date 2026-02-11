---

description: "Task list for implementing Loot Table → Chests"
---

# Tasks: Loot Table - Chests

**Input**: Design documents from `specs/002-chest-loot-table/`
**Prerequisites**: `spec.md` (required), `plan.md` (required), `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Unit tests are included ONLY where the project constitution requires them (data model mapping / deterministic math).

## Format

Every task uses this format:

- [ ] T### [P?] [US?] Description with file path

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create feature folder structure in `src/features/loot-tables/chests/` and `src/features/loot-tables/shared/`
- [ ] T002 Create transformer folder structure in `transformer/loot_tables/`
- [ ] T003 Add transformer TypeScript config in `transformer/tsconfig.json`
- [ ] T004 Update TS project references to include transformer build in `tsconfig.json`
- [ ] T005 Add transformer build output folder ignore rules in `.gitignore`
- [ ] T006 Add unit test runner (Vitest) + `test` script in `package.json`
- [ ] T007 [P] Add Vitest config (if needed) in `vitest.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [ ] T008 Define published loot-table index + chest file TS types in `src/models/published_chest_loot_table.ts`
- [ ] T009 [P] Add typed JSON fetch helper in `src/features/loot-tables/shared/fetchJson.ts`
- [ ] T010 [P] Add number formatting helper (2 decimals, trim zeros) in `src/features/loot-tables/shared/formatNumber.ts`
- [ ] T011 Add minimal sample published data for local UI dev in `public/data/loot_tables/index.json`
- [ ] T012 [P] Add one sample chest file matching the segment model in `public/data/loot_tables/chest_sample.json`
- [ ] T013 Add “missing/empty index” empty-state component in `src/features/loot-tables/shared/EmptyState.tsx`

**Checkpoint**: Foundation ready — UI and transformer stories can proceed.

---

## Phase 3: User Story 1 — View chest loot outcomes (Priority: P1) 🎯 MVP

**Goal**: User can open **Loot Table → Chests** and view expected loot per X chests, with Level/Item Rarity/Item Quantity changing the displayed results.

**Independent Test**: Run `yarn dev`, navigate to the Chests page, confirm the table renders from `public/data/loot_tables/index.json`, and changing Level changes the selected segment and displayed amounts.

### Implementation (US1)

- [ ] T014 [US1] Add minimal routing + nav entry “Loot Table → Chests” in `src/App.tsx` (FR-001)
- [ ] T015 [P] [US1] Create chests page component scaffold in `src/features/loot-tables/chests/ChestsPage.tsx`
- [ ] T016 [P] [US1] Add settings state (non-persisted) + defaults in `src/features/loot-tables/chests/useLootSettings.ts`
- [ ] T017 [P] [US1] Implement level segment selection utility in `src/features/loot-tables/chests/selectLevelSegment.ts` (FR-008, clamp 0–100)
- [ ] T018 [US1] Load index + chest JSON and wire into page in `src/features/loot-tables/chests/ChestsPage.tsx` (FR-002, FR-008)
- [ ] T019 [P] [US1] Implement rarity weight adjustment logic in `src/features/loot-tables/chests/rarity.ts` (FR-008b)
- [ ] T020 [P] [US1] Implement quantity scaling rules in `src/features/loot-tables/chests/quantity.ts` (FR-008c)
- [ ] T021 [P] [US1] Implement deterministic expected value math in `src/features/loot-tables/chests/expectedValue.ts` (FR-008a, FR-021, FR-022)
- [ ] T022 [US1] Aggregate duplicate item ids deterministically in `src/features/loot-tables/chests/aggregateItems.ts` (FR-019, FR-020)
- [ ] T023 [US1] Render table with columns (chest, item, amount per X) in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-003)
- [ ] T024 [US1] Add controls for Per X chests, Level, Item Rarity, Item Quantity in `src/features/loot-tables/chests/ChestsControls.tsx` (FR-004, FR-006)
- [ ] T025 [US1] Apply number formatting rules (2 decimals, trim zeros) in `src/features/loot-tables/chests/ChestsTable.tsx` (FR-006a)
- [ ] T026 [US1] Handle weight=0 edge cases without crashing in `src/features/loot-tables/chests/expectedValue.ts` (Edge Cases)
- [ ] T027 [US1] Ensure derived recomputation stays responsive via memoization in `src/features/loot-tables/chests/ChestsPage.tsx` (SC-003/003a/003b)

### Unit tests (required by constitution for deterministic math)

- [ ] T028 [P] [US1] Add expected value unit tests for simple synthetic inputs in `src/features/loot-tables/chests/expectedValue.test.ts`
- [ ] T029 [P] [US1] Add quantity/rarity scaling unit tests in `src/features/loot-tables/chests/quantity.test.ts` and `src/features/loot-tables/chests/rarity.test.ts`

**Checkpoint**: US1 works end-to-end using sample `public/data/loot_tables/` data.

---

## Phase 4: User Story 2 — Configure and persist settings (Priority: P2)

**Goal**: Settings (Per X, Level, Item Rarity, Item Quantity) persist across reloads and stay in sync between slider and text input.

**Independent Test**: Change settings on Chests page, reload, verify values restored and results identical.

- [ ] T030 [US2] Define localStorage schema + keys + migration-safe parsing in `src/features/loot-tables/chests/settingsStorage.ts` (FR-005)
- [ ] T031 [US2] Integrate persistence into settings hook in `src/features/loot-tables/chests/useLootSettings.ts` (FR-005)
- [ ] T032 [US2] Implement slider <-> numeric input sync for Per X in `src/features/loot-tables/chests/ChestsControls.tsx` (Story 2 scenario #2)
- [ ] T033 [US2] Persist and restore Item Quantity/Item Rarity in `src/features/loot-tables/chests/useLootSettings.ts` (Story 2 scenario #3)
- [ ] T034 [P] [US2] Add persistence unit tests for parse/serialize + defaults in `src/features/loot-tables/chests/settingsStorage.test.ts`

**Checkpoint**: US2 persistence verified via reload.

---

## Phase 5: User Story 3 — Maintain published chest loot data (Priority: P3)

**Goal**: Maintainer runs one command to generate `public/data/loot_tables/index.json` and consolidated `public/data/loot_tables/chest_*.json` from VH sources.

**Independent Test**: Run the command, confirm outputs exist, thresholds consolidate correctly, and `_raw.json` is excluded.

### Implementation (US3)

- [ ] T035 [P] [US3] Define source loot-table input types and parser in `transformer/loot_tables/minecraftLootTable.ts`
- [ ] T036 [US3] Implement chest file discovery + `_raw` exclusion in `transformer/loot_tables/chests.ts` (FR-009, FR-010)
- [ ] T037 [US3] Implement threshold grouping + segment range derivation in `transformer/loot_tables/chests.ts` (FR-011, FR-012, FR-017/FR-017a)
- [ ] T038 [US3] Implement transform from source pools to tiered segment model in `transformer/loot_tables/chests.ts` (FR-013, FR-014, FR-015, FR-019)
- [ ] T039 [US3] Implement index generation + write outputs into `public/data/loot_tables/` in `transformer/loot_tables/chests.ts` (FR-016, FR-018)
- [ ] T040 [US3] Add repository command `yarn run generate:loot-tables` in `package.json` to run transformer build + execution
- [ ] T041 [US3] Update quickstart command section in `specs/002-chest-loot-table/quickstart.md` to match the real script name

### Unit tests (required by constitution for mapping)

- [ ] T042 [P] [US3] Add segment consolidation unit tests (ranges + ordering) in `transformer/loot_tables/chests.test.ts` (FR-012)
- [ ] T043 [P] [US3] Add `_raw` exclusion test in `transformer/loot_tables/chests.test.ts` (FR-010)
- [ ] T044 [P] [US3] Add transform shape tests (roll/count ranges, weights preserved) in `transformer/loot_tables/chests.test.ts` (FR-014, FR-015)

**Checkpoint**: US3 command produces publishable JSON and UI loads it.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T045 [P] Accessibility pass for controls (labels, keyboard nav, focus) in `src/features/loot-tables/chests/ChestsControls.tsx` (Constitution: WCAG intent)
- [ ] T046 Add “no data” messaging for missing/empty index in `src/features/loot-tables/chests/ChestsPage.tsx` (Edge Case)
- [ ] T047 [P] Add brief PR testing note template to `README.md` (Constitution: testing note)
- [ ] T048 Run end-to-end local verification checklist update in `specs/002-chest-loot-table/quickstart.md`

---

## Dependencies & Execution Order

### Story completion order

- Setup → Foundational → US1 (MVP) → US2 → US3 → Polish

### User story dependency graph

- US1 depends on Foundational sample data in `public/data/loot_tables/`
- US2 depends on US1 UI existing (persistence wraps the same controls)
- US3 can be developed in parallel with US1/US2 after Foundational, but is required to satisfy maintainer workflow (SC-005/SC-006)

---

## Parallel Execution Examples

### US1 parallel work

- [P] `src/features/loot-tables/chests/expectedValue.ts` math (T021)
- [P] `src/features/loot-tables/chests/ChestsControls.tsx` controls (T024)
- [P] `src/features/loot-tables/chests/ChestsTable.tsx` table (T023)

### US3 parallel work

- [P] `transformer/loot_tables/minecraftLootTable.ts` parser (T035)
- [P] `transformer/loot_tables/chests.test.ts` test scaffolding (T042)

---

## Implementation Strategy

### MVP scope (recommended)

- Complete Phase 1 + Phase 2 + Phase 3 (US1) using sample data in `public/data/loot_tables/`.

### Incremental delivery

- US1 first for user-facing value.
- US2 next to satisfy persistence requirements.
- US3 last to provide maintainable, repeatable data publishing.
