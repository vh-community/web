# Feature Specification: Loot Table - Chests

**Feature Branch**: `002-chest-loot-table`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "Loot Table → Chests page + transform vault chest loot tables into published tiered JSON; settings persist; level/item rarity/item quantity affect results"

## Clarifications

### Session 2026-02-11

- Q: How should “how many you get if you loot X chests” be computed from the VH/Minecraft loot tables? → A: Exact analytic expected value computed deterministically from the published tiered loot model (no simulation).
- Q: What should the published loot-table file format look like? → A: One file per chest type containing a level-based tiered loot model (stored as level segments); plus a single index listing which chest tables to display.
- Q: What should the Per X chests control’s range/default be? → A: 1-10000 def100
- Q: How should the UI display/round the “expected amount per X chests”? → A: Show up to 2 decimals; trim trailing zeros.
- Q: If the same item id appears multiple times (across tiers and/or within a tier), how should it be represented? → A: Keep separate rows but group visually by itemId (UI aggregates).
- Q: How should the published chest file represent “levels”? → A: As an array of level segments, each with `[minLevel,maxLevel]` and a tiered loot definition; the UI selects the matching segment for the current Level.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View chest loot outcomes (Priority: P1)

As a site user, I can open **Loot Table → Chests** and see a table of chest loot that includes the chest type, the item, and the expected amount I would get after looting *X* chests.

**Why this priority**: This is the primary user value: quickly understanding chest loot outcomes.

**Independent Test**: Can be fully tested by opening the page and verifying it renders chest data from the published loot table files, and that changing *Level* changes which loot rows are shown.

**Acceptance Scenarios**:

1. **Given** the user navigates to Loot Table → Chests, **When** chest data exists in the published index, **Then** the page shows a table with columns for chest type, item, and amount per X chests.
2. **Given** the page is open, **When** the user changes Level, **Then** the displayed loot updates to the level-appropriate loot table for each chest.
3. **Given** the page is open, **When** the user changes Item Quantity or Item Rarity, **Then** the displayed expected amounts update according to the documented formulas.
4. **Given** the page is open and loot rows are displayed, **When** an item has results in one or more tiers, **Then** the item row visually indicates tier rarity using the tier-based translucent background rules defined in the functional requirements.

---

### User Story 2 - Configure and persist settings (Priority: P2)

As a site user, I can adjust calculation settings (X chests, Level, Item Rarity, Item Quantity) and have them persist across page reloads and future sessions.

**Why this priority**: Users often revisit and compare results; persistence removes repetitive setup.

**Independent Test**: Can be fully tested by changing settings, reloading the page, and verifying the values are restored.

**Acceptance Scenarios**:

1. **Given** the user changes any setting, **When** the page is reloaded, **Then** the previously chosen values are restored.
2. **Given** the user changes X chests using the slider, **When** the value changes, **Then** the text field matches it (and vice versa).
3. **Given** the user changes Item Quantity or Item Rarity, **When** the page is reloaded, **Then** those values are restored and produce the same displayed results.

---

### User Story 3 - Maintain published chest loot data (Priority: P3)

As a maintainer, I can run a single repository command that extracts the source chest loot tables, consolidates level-based variants, and writes tiered, level-indexed chest loot files plus an index that drives the Chests page.

**Why this priority**: The UI depends on having reliable, up-to-date data published into a stable format.

**Independent Test**: Can be fully tested by running the transform command and verifying it produces the expected set of output files, including correct level-threshold handling and skipping legacy “raw” tables.

**Acceptance Scenarios**:

1. **Given** source loot table files exist for multiple level thresholds (e.g., `gilded_chest_0`, `gilded_chest_20`, `gilded_chest_50`), **When** the transform is run, **Then** the output contains a single consolidated `gilded_chest` chest file whose `levels[..]` entries have levelRange: `[minLevel,maxLevel]` ranges derived from those thresholds (e.g., `[0,19]`, `[20,49]`, `[50,100]`).
2. **Given** a source loot table file ends with `_raw`, **When** the transform is run, **Then** that file is excluded from outputs and does not affect consolidation.

---

### Edge Cases

- When there is no chest loot table data available (missing index or empty index).
- When a selected Level is outside 0–100 (the UI must clamp or reject input and remain stable).
- When a chest loot table contains an item more than once across different internal pools (the UI must aggregate per itemId deterministically).
- When X chests is set to its minimum or maximum value.
- When Item Quantity or Item Rarity is set to its minimum or maximum value.
- When a pool or item list has total weight 0 (must not crash; results should be treated as 0 expected for that pool).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a menu entry at **Loot Table → Chests** that navigates to the chest loot table page.
- **FR-002**: The Chests page MUST load a loot table index from `public/data/loot_tables/index.json` and render all index entries flagged for display.
- **FR-003**: For each displayed chest type, the page MUST show loot rows containing:
  - Chest type identifier (and/or display name)
  - Item identifier (human-readable label if available)
  - Expected amount for the current “per X chests” setting
- **FR-003a (Tier rarity visual treatment)**: The UI MUST visually indicate the tier rarity for each displayed item using translucent background coloring with this mapping:
  - Common → Gray
  - Rare → Blue
  - Epic → Purple
  - Omega → Green
  The tier-based background coloring MUST follow these rules:
  - For the item identity (icon + item name), if the item appears in multiple tiers, the background color MUST be based on the **lowest** tier in which the item appears (Common < Rare < Epic < Omega).
  - For the displayed count/amount breakdown, the background color MUST reflect the **specific tier** for that tier’s sub-row/count entry (i.e., the same item may show multiple count entries with different tier background colors).
- **FR-004**: The page MUST provide user-configurable options:
  - **Per X chests**: slider plus text input, kept in sync (min 1, max 10000, default 100)
  - **Level**: integer from 0 to 100
  - **Item Rarity**: percentage from 0% to 300%
  - **Item Quantity**: percentage from 0% to 300%
- **FR-005**: All options MUST be persisted locally and restored on next visit.
- **FR-006**: Changing **Per X chests** MUST update displayed expected amounts based on multiplication by X.
- **FR-006a**: Displayed expected amounts MUST be formatted with up to 2 decimal places and trailing zeros trimmed (e.g., `1`, `1.2`, `1.23`).
- **FR-007**: **Level**, **Item Rarity**, and **Item Quantity** MUST all affect the displayed expected amounts.
- **FR-008**: The system MUST load chest loot tables from `public/data/loot_tables/chest_[name].json` (or equivalent index-provided path) and select the applicable level segment whose `[minLevel,maxLevel]` contains the current Level.

- **FR-008a**: The system MUST compute expected amounts deterministically from the published tiered loot model and the current settings (no simulation).

- **FR-008b (Item Rarity calculation)**: For Item Rarity percentage $r\%$ (0–300%), the system MUST use multiplier $m_r = 1 + r/100$ and adjust pool weights as follows:
  - Common pool weight is unchanged
  - Rare pool weight is multiplied by $m_r$
  - Epic pool weight is multiplied by $m_r$
  - Omega pool weight is multiplied by $m_r$
  - Pool selection probabilities are computed from the resulting effective pool weights

- **FR-008c (Item Quantity calculation)**: For Item Quantity percentage $q\%$ (0–300%), the system MUST use multiplier $m_q = 1 + q/100$ and adjust both:
  - The number of rolls for the chest at the selected level
  - The stack/count range for each item
  using these floor-based scaling rules:
  - `minRoll = min(floor(minRoll * m_q), 54)`
  - `maxRoll = min(floor(maxRoll * m_q), 54)`
  - `minStack = floor(minStack * m_q)`
  - `maxStack = floor(maxStack * m_q)`

- **FR-009**: The transform step MUST scan the repository’s source loot table directory and extract all loot tables whose file names contain `chest`.
- **FR-010**: The transform step MUST skip any source files ending with `_raw.json`.
- **FR-011**: The transform step MUST consolidate multiple level-threshold variants into a single output per chest type.
- **FR-012**: The transform step MUST derive level applicability using the numeric suffix as the inclusive minimum level, and the next threshold minus 1 as the inclusive maximum level (with the last threshold applying through level 100).
- **FR-013**: Output loot tables MUST be transformed into a tiered loot model that preserves enough information to compute deterministic expected values under Level, Item Rarity, and Item Quantity modifiers.
- **FR-014**: The published model MUST preserve (per level) the chest roll range and (per item) the item count/stack range required by the Item Quantity formula.
- **FR-015**: The published model MUST preserve (per level) pool weights and item weights required by the Item Rarity formula.
- **FR-016**: The transform step MUST output one consolidated published file per chest type.
- **FR-017**: Each consolidated chest file MUST contain a list of level segments that collectively cover levels 0–100 inclusive.
- **FR-017a**: Each level segment MUST include an inclusive `[minLevel,maxLevel]` and the applicable tiered loot definition for that level range.
- **FR-018**: The index file MUST enumerate all consolidated chest files intended for display, including a stable identifier and the relative path to the data file.
- **FR-019**: The published tiered loot items MAY contain duplicate `id` values across tiers and/or within a tier.
- **FR-020**: The UI MUST group rows by item `id` for display and calculations but have sub-rows for each tier so that the item's value is broken down by tier in the display.

- **FR-021 (Expected value definition)**: For any uniform integer range with inclusive bounds `[min,max]`, the expected value MUST be computed as $(min + max) / 2$ after applying any required floor-based scaling to the bounds.
- **FR-022 (Per-item expectation)**: For a given level entry, the expected amount per chest for an item MUST be computed as:
  - $E[rolls] \times P(pool) \times P(item \mid pool) \times E[count]$
  using the effective (Item Rarity-adjusted) pool weights and the effective (Item Quantity-adjusted) roll and count ranges.

### Key Entities *(include if feature involves data)*

- **User Loot Settings**: Locally stored preferences for per-X, Level, Item Rarity, and Item Quantity.
- **Loot Table Index**: A published list of loot table entries to display (currently chests), including their identifiers and data file paths.
- **Chest Loot Table**: A published, consolidated definition of a chest type’s loot across levels 0–100.
- **Tiered Loot Table (per chest type)**: A published model of a chest’s loot broken down by level and rarity tiers (common/rare/epic/omega), including roll ranges, pool weights, and item weights/counts.
- **Tier (Common/Rare/Epic/Omega)**: A rarity tier/pool within a level definition.
- **Loot Item**: A single item entry within a tier, with a weight and a count/stack definition.

### Published Data Shape (informative)

- **Index entry**: `{ id, type, name?, file, show }`
- **Chest file**: `{ id, levels: TieredLootTableLevelSegment[] }`

### Published Level Shape (informative)

Each level entry MUST include:

- Roll range: `{ roll: { min, max } }`
- Four tier pools: `common`, `rare`, `epic`, `omega`
- Each tier pool MUST include:
  - Tier weight
  - A list of items with `id`, `weight`, and count/stack range `{ min, max }`

### Tiered Loot Model (informative)

This feature uses the project’s tiered loot table domain model (see `src/models/tiered_loot_table.ts`) as the baseline shape.

- A chest file contains `levels` a list of level entries.
- Each level contains 4 tiers: `common`, `rare`, `epic`, `omega`.
- Each level contains a level range `[minLevel,maxLevel]`.
- Each tier contains:
  - A tier weight (for choosing the tier)
  - A list of items each with `id`, `weight`, and a base count/stack definition

Note: The published chest data MUST also include the roll range and item count/stack range needed for the Item Quantity formula, even if this requires extending the baseline tiered model.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can reach the Chests loot page from the main navigation and see chest loot rows without errors.
- **SC-002**: Changing Level updates the displayed loot for at least one chest type in a way that matches the level-threshold applicability rules.
- **SC-003**: Changing Per X chests updates the displayed expected amounts within 0.5 seconds.
- **SC-003a**: Changing Item Quantity updates the displayed expected amounts within 0.5 seconds.
- **SC-003b**: Changing Item Rarity updates the displayed expected amounts within 0.5 seconds.
- **SC-004**: After changing any setting, a page reload restores the same values with no additional user action.
- **SC-005**: Running the transform step produces consolidated chest loot files for all eligible source chest tables and produces an index that drives the UI.
- **SC-006**: No output is produced from `_raw.json` source files, and they do not affect consolidated results.

## Assumptions

- “How many you get” is displayed as an expected (average) value per X chests; the UI may present rounding suitable for readability.
- The published loot table format is allowed to change as long as it remains stable for the site and contains the required entities/fields.
- Item Quantity and Item Rarity calculations follow the definitions in `docs/ItemQuantity.md` and `docs/ItemRarity.md`.
