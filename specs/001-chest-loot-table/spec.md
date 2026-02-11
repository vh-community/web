# Feature Specification: Loot Table - Chests

**Feature Branch**: `001-chest-loot-table`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "Loot Table → Chests page + transform vault chest loot tables into flattened public JSON; settings persist; level affects results"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View chest loot outcomes (Priority: P1)

As a site user, I can open **Loot Table → Chests** and see a table of chest loot that includes the chest type, the item, and the expected amount I would get after looting *X* chests.

**Why this priority**: This is the primary user value: quickly understanding chest loot outcomes.

**Independent Test**: Can be fully tested by opening the page and verifying it renders chest data from the published loot table files, and that changing *Level* changes which loot rows are shown.

**Acceptance Scenarios**:

1. **Given** the user navigates to Loot Table → Chests, **When** chest data exists in the published index, **Then** the page shows a table with columns for chest type, item, and amount per X chests.
2. **Given** the page is open, **When** the user changes Level, **Then** the displayed loot updates to the level-appropriate loot table for each chest.

---

### User Story 2 - Configure and persist settings (Priority: P2)

As a site user, I can adjust calculation settings (X chests, Level, Item Rarity, Item Quantity) and have them persist across page reloads and future sessions.

**Why this priority**: Users often revisit and compare results; persistence removes repetitive setup.

**Independent Test**: Can be fully tested by changing settings, reloading the page, and verifying the values are restored.

**Acceptance Scenarios**:

1. **Given** the user changes any setting, **When** the page is reloaded, **Then** the previously chosen values are restored.
2. **Given** the user changes X chests using the slider, **When** the value changes, **Then** the text field matches it (and vice versa).

---

### User Story 3 - Maintain published chest loot data (Priority: P3)

As a maintainer, I can run a single repository command that extracts the source chest loot tables, consolidates level-based variants, and writes flattened loot table files plus an index that drives the Chests page.

**Why this priority**: The UI depends on having reliable, up-to-date data published into a stable format.

**Independent Test**: Can be fully tested by running the transform command and verifying it produces the expected set of output files, including correct level ranges and skipping legacy “raw” tables.

**Acceptance Scenarios**:

1. **Given** source loot table files exist for multiple level thresholds (e.g., `gilded_chest_0`, `gilded_chest_20`, `gilded_chest_50`), **When** the transform is run, **Then** the output contains a single consolidated `gilded_chest` loot table with level ranges derived from those thresholds.
2. **Given** a source loot table file ends with `_raw`, **When** the transform is run, **Then** that file is excluded from outputs and does not affect consolidation.

---

### Edge Cases

- When there is no chest loot table data available (missing index or empty index).
- When a selected Level falls outside all defined level ranges for a chest type.
- When a chest loot table contains an item more than once across different internal pools (the flattened view must combine them deterministically).
- When X chests is set to its minimum or maximum value.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a menu entry at **Loot Table → Chests** that navigates to the chest loot table page.
- **FR-002**: The Chests page MUST load a published loot table index and render all index entries flagged for display.
- **FR-003**: For each displayed chest type, the page MUST show loot rows containing:
  - Chest type identifier (and/or display name)
  - Item identifier (human-readable label if available)
  - Expected amount for the current “per X chests” setting
- **FR-004**: The page MUST provide user-configurable options:
  - **Per X chests**: slider plus text input, kept in sync
  - **Level**: integer from 0 to 100
  - **Item Rarity**: percentage from 0% to 300%
  - **Item Quantity**: percentage from 0% to 300%
- **FR-005**: All options MUST be persisted locally and restored on next visit.
- **FR-006**: Changing **Per X chests** MUST update displayed expected amounts based on multiplication by X.
- **FR-007**: For this feature version, only **Level** MUST change which loot data is used (by selecting the correct level range for each chest type). Item Rarity and Item Quantity MUST be stored/restored but MUST NOT change results yet.
- **FR-008**: The system MUST load published chest loot tables (as referenced by the index) and select the applicable level range based on the current Level.

- **FR-009**: The transform step MUST scan the repository’s source loot table directory and extract all loot tables whose file names contain `chest`.
- **FR-010**: The transform step MUST skip any source files ending with `_raw.json`.
- **FR-011**: The transform step MUST consolidate multiple level-threshold variants into a single output per chest type.
- **FR-012**: The transform step MUST derive level ranges using the numeric suffix as the inclusive minimum level, and the next threshold minus 1 as the inclusive maximum level (with the last range extending through level 100).
- **FR-013**: Output loot tables MUST be flattened so that each chest-level-range provides a single list of item rows suitable for direct calculation.
- **FR-014**: For each item row in a flattened list, the output MUST include an “expected items per chest” value (a non-negative number) that can be multiplied by X to produce “expected items per X chests”.

### Key Entities *(include if feature involves data)*

- **User Loot Settings**: Locally stored preferences for per-X, Level, Item Rarity, and Item Quantity.
- **Loot Table Index**: A published list of loot table entries to display (currently chests), including their identifiers and data file paths.
- **Chest Loot Table**: A published, consolidated definition of a chest type’s loot across level ranges.
- **Level Range**: A minimum and maximum level boundary with an associated flattened loot row list.
- **Loot Row**: A single item entry for display and calculations, including item identifier and expected items per chest.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can reach the Chests loot page from the main navigation and see chest loot rows without errors.
- **SC-002**: Changing Level updates the displayed loot for at least one chest type in a way that matches defined level ranges.
- **SC-003**: Changing Per X chests updates the displayed expected amounts within 0.5 seconds.
- **SC-004**: After changing any setting, a page reload restores the same values with no additional user action.
- **SC-005**: Running the transform step produces consolidated chest loot files for all eligible source chest tables and produces an index that drives the UI.
- **SC-006**: No output is produced from `_raw.json` source files, and they do not affect consolidated results.

## Assumptions

- “How many you get” is displayed as an expected (average) value per X chests; the UI may present rounding suitable for readability.
- The published loot table format is allowed to change as long as it remains stable for the site and contains the required entities/fields.
- The initial release only uses Level-dependent loot differences; Item Rarity and Item Quantity are saved for future use.
