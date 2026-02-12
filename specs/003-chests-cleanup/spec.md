# Feature Specification: Chests Cleanup

**Feature Branch**: `003-chests-cleanup`  
**Created**: 2026-02-12  
**Status**: Draft  
**Input**: User description: "Chests cleanup: refactor loot-table generator workflow; unify loot table models; restructure UI into pages/components; rename generated chest files; improve Chests UI/UX."

This spec is based on the amendment list captured in `specs/003-chests-cleanup/amendment.md`.

## Clarifications

### Session 2026-02-12

- Q: Should we keep `openapi.yaml` and “published*” models for static JSON contracts? → A: Delete `openapi.yaml` and use `src/models/tieredLootTable.ts` as the single canonical model for transformer output and UI consumption.
- Q: How should the Treasure chest be hidden? → A: Do not generate it at all (no index entry and no published chest file).
- Q: What is the exact rule for concise generated chest filenames? → A: Remove `_chest` only when it is a trailing suffix of the chest id.
- Q: Where should the canonical loot table model live, and how should the transformer consume it? → A: Canonical model lives in `src/models/tieredLootTable.ts` and the transformer imports it directly (no type duplication).
- Q: What model should define the published JSON index format? → A: Use `src/models/jsonIndex.ts` as the canonical model; the transformer imports and emits `public/data/loot_tables/index.json` using this type.
- Q: Can we change the `TieredLootTable` interface shape while unifying models? → A: No. `src/models/tieredLootTable.ts` is the canonical contract and MUST remain unchanged; generator output and UI consumption MUST adapt to its existing field names and structure.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Browse chests quickly (Priority: P1)

As a site user, I can browse the **Loot Table → Chests** page with a clear per-chest layout, a predictable chest ordering, and the ability to quickly find a chest by name.

**Why this priority**: This is the primary user value for the page: quickly answer “what do I get from this chest?” without fighting the UI.

**Independent Test**: Can be fully tested by opening the Chests page with published data present, confirming the order and sections, and using search to narrow results.

**Acceptance Scenarios**:

1. **Given** the user is on Loot Table → Chests, **When** published chest data loads, **Then** each chest is shown in its own section with a visible header.
2. **Given** multiple chests are visible, **When** the page renders, **Then** chests appear in this order: Wooden, Living, Gilded, Ornate, Hardened, Flesh, Enigma.
3. **Given** the user types into the chest search input, **When** the query changes, **Then** only chest sections whose names match the query are shown.
4. **Given** “treasure” chest data exists, **When** the page renders, **Then** the Treasure chest does not appear.

---

### User Story 2 - Understand items at a glance (Priority: P2)

As a site user, I can read item names in a friendly format (not raw IDs) and scan a visually clear table that still preserves the tier-based background color scheme.

**Why this priority**: Raw item IDs are hard to interpret quickly; improving readability reduces friction and makes the table useful for non-technical players.

**Independent Test**: Can be fully tested by opening the page and verifying item labels are human-readable and the table styling remains consistent and legible.

**Acceptance Scenarios**:

1. **Given** an item id like `minecraft:diamond_sword`, **When** the page renders, **Then** the item label is displayed as a friendly name like “Diamond Sword”.
2. **Given** the table shows tier rows, **When** the page renders, **Then** the table uses clear borders/spacing/typography and retains tier-based background cues.

---

### User Story 3 - Maintain data and codebase efficiently (Priority: P3)

As a maintainer, I can regenerate published chest loot tables and evolve the codebase structure without duplicated domain models or hard-to-debug build artifacts.

**Why this priority**: This work reduces maintenance burden and makes future loot-table pages easier to add.

**Independent Test**: Can be fully tested by running the loot-table generation command, verifying the expected published JSON output and file naming, and verifying the repo layout conventions are followed.

**Acceptance Scenarios**:

1. **Given** the maintainer runs the loot-table generation command, **When** it completes successfully, **Then** the command produces the published JSON outputs without introducing committed build artifacts for the transformer.
2. **Given** the published data is regenerated, **When** the output files are written, **Then** chest JSON filenames follow the concise naming convention (e.g., `chest_gilded.json`).
3. **Given** the codebase is opened, **When** browsing the Chests page implementation, **Then** page code is organized under the page-based directory structure and shared loot-table page helpers are located in the shared pages folder.

---

### Edge Cases

- Search query matches no chest sections (should show “no matches” state and not crash).
- A chest does not match any known category ordering (should be placed after the known categories in a stable order).
- Chest label differs from chest id (search should match both label and id).
- Item id is missing a namespace (e.g., `diamond_sword`) (friendly name formatting should still work).
- The Treasure chest exists in source data but must not be present in published output.
- Published chest file names change (UI should still load based on index file entries).

## Requirements *(mandatory)*

### Functional Requirements

#### Developer workflow and data generation

- **FR-001 (A001)**: The repository MUST provide a loot-table generation command that runs from source in a debugging-friendly way and MUST NOT produce committed build output files for the transformer.
- **FR-002 (A002, A006)**: The generator and UI MUST use a single canonical tiered loot table model definition located at `src/models/tieredLootTable.ts` (no duplicated “published” model types).
- **FR-002a**: The generator MUST use `src/models/jsonIndex.ts` as the canonical model for the published index file.
- **FR-003 (A008)**: Generated chest loot table JSON files MUST use a concise naming convention where redundant chest words are removed (e.g., `chest_gilded.json` instead of `chest_gilded_chest.json`).
- **FR-003b**: The concise naming rule MUST remove `_chest` only when it is a trailing suffix of the chest id.
- **FR-003a**: The repository MUST NOT maintain an OpenAPI contract for these static JSON files (remove `specs/**/contracts/openapi.yaml`).

#### Code organization

- **FR-004 (A003)**: Chests page code MUST be organized under a page-based directory: `src/pages/loot-tables/chests/`.
- **FR-005 (A007)**: Loot-table page shared helpers/components MUST live under `src/pages/loot-tables/` (shared across loot-table pages).
- **FR-006 (A004)**: The site header and footer MUST be reusable components located at `src/components/Header.tsx` and `src/components/Footer.tsx`.
- **FR-007 (A005)**: The main navigation MUST be a reusable component located at `src/components/Navigation.tsx`.

#### Chests UI/UX

- **FR-008 (A009, A010)**: Settings controls MUST be user-friendly, consistent across all settings, and visually aligned with the rest of the site.
  - All settings controls MUST use a consistent layout (label placement, spacing, input sizing) across Per X, Level, Item Rarity, and Item Quantity.
  - Settings MUST be keyboard operable and have visible labels.
  - The Level control’s visual style MUST be consistent with the other settings controls and MAY use https://vaulthunters.gg/gear as inspiration for “look and feel” consistency.
- **FR-009 (A011)**: The Chests page MUST render each chest as its own section with a visible header.
- **FR-010 (A012)**: Chest sections MUST be presented in this category order: Wooden, Living, Gilded, Ornate, Hardened, Flesh, Enigma.
- **FR-011 (A013)**: The Chests page MUST include a search input that filters visible chest sections by name.
- **FR-012 (A014)**: Item labels MUST be displayed in a human-friendly format derived from the raw item id.
- **FR-013 (A015)**: The Treasure chest MUST NOT be generated into published output (no index entry and no published chest file), and therefore MUST not appear in the UI.
- **FR-014 (A016)**: The results table MUST be visually improved (borders/spacing/typography) while preserving the tier-based background color scheme.

## Assumptions

- Chest category ordering is derived from chest identifiers and/or display names; unknown chests are treated as “uncategorized” and appear after the known categories.
- The “Treasure chest” is identifiable in source loot tables and can be excluded deterministically during generation.
- “Friendly item names” are derived from item ids by: removing any namespace prefix (text before `:`), splitting on `_`, and title-casing words (e.g., `minecraft:diamond_sword` → “Diamond Sword”).
- Concise generated filenames are derived from the chest id by removing a trailing `_chest` suffix when present.
- The published JSON schema for loot tables is defined by the canonical TypeScript model(s) and the generator output, not by an OpenAPI contract.

## Dependencies

- The Chests page depends on published loot table JSON being present and loadable in the site’s static data directory.

## Out of Scope

- Adding new loot-table pages beyond the existing Chests page.
- Introducing new gameplay calculations or changing the expected value math.
- Adding integrations for external item-name databases.

## Key Entities *(include if feature involves data)*

- **Chest Category Order**: The fixed ordering list used to present chest sections.
- **Chest Search Query**: User-entered text used to filter chest sections by name.
- **Item Display Name**: The user-friendly representation of an item id.
- **Published Chest Loot Files**: Static JSON files used by the Chests page.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can locate a specific chest via search and see its loot section within 10 seconds.
- **SC-002**: Chest sections always render in the specified category order, with any unknown chests consistently placed after known categories.
- **SC-003**: Item labels are readable and consistently formatted (e.g., `minecraft:diamond_sword` → “Diamond Sword”) across all displayed results.
- **SC-004**: Running the loot-table generation command produces the expected published JSON outputs and does not introduce new transformer build output files that would be committed.
