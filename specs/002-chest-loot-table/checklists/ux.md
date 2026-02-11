# UX Checklist: Loot Table - Chests

**Purpose**: Validate that the UX requirements for the Chests loot table are complete, clear, consistent, and measurable (requirements quality; not implementation testing).
**Created**: 2026-02-11
**Feature**: specs/002-chest-loot-table/spec.md

## Requirement Completeness

- [x] CHK001 Are navigation entry requirements fully specified (label, location, and destination) rather than just “provide a menu entry”? [Completeness, Spec §FR-001]
- [x] CHK002 Are the table column definitions complete (including whether chest type uses `id`, `name`, or both) and are there requirements for column ordering? [Completeness, Spec §FR-003]
- [x] CHK003 Is the source of the “human-readable label” explicitly specified (where it comes from and fallback when unavailable)? [Ambiguity, Spec §FR-003]
- [x] CHK004 Are the control types and allowed input formats specified for all settings (slider/text for X, numeric vs select for the others)? [Completeness, Spec §FR-004]
- [x] CHK005 Are defaults/ranges specified for Level, Item Rarity, and Item Quantity (including whether the UI accepts decimals or integers)? [Clarity, Spec §FR-004]
- [x] CHK006 Are persistence requirements specific about storage mechanism, key names/versioning, and reset behavior (if any)? [Gap, Spec §FR-005]
- [x] CHK007 Are requirements defined for the “no data” state (missing index, empty index) including user-facing messaging and what remains interactive? [Gap, Spec §Edge Cases]
- [x] CHK008 Are requirements defined for loading states (index fetch in-flight; per-chest fetch in-flight) and whether partial data may render? [Gap, Spec §FR-002]
- [x] CHK009 Are requirements defined for error states (index fetch fails, chest file fetch fails, malformed JSON) including user-facing messaging vs silent failure? [Gap, Spec §FR-002]
- [x] CHK010 Are requirements defined for table row ordering (by chest, by item, stable sort) so “deterministic” also applies to presentation? [Gap, Spec §FR-003]

## Requirement Clarity

- [x] CHK011 Is “Per X chests” synchronization fully defined for invalid/empty input (e.g., blank text field, non-numeric characters, out-of-range values)? [Ambiguity, Spec §User Story 2, Spec §FR-004]
- [x] CHK012 Is the Level out-of-range behavior explicitly chosen (clamp vs reject), and is the exact UX specified (e.g., auto-correct on blur vs immediate)? [Ambiguity, Spec §Edge Cases, Spec §FR-004]
- [x] CHK013 Is the formatting rule “up to 2 decimals; trim trailing zeros” fully unambiguous for values like `0.005`, very large numbers, and negative/NaN (if possible)? [Clarity, Spec §FR-006a]
- [x] CHK014 Is it clear whether Item Rarity/Quantity controls represent “extra %” (0–300 as +0%..+300%) vs “total %” (0–300 as 0%..300%) and is this consistent with the multiplier formulas? [Clarity, Spec §FR-004, Spec §FR-008b, Spec §FR-008c]
- [x] CHK015 Is it explicit how the UI chooses the “applicable” level segment when Level equals `minLevel` or `maxLevel` (inclusive boundaries)? [Clarity, Spec §FR-008, Spec §FR-017a]
- [x] CHK016 Is the meaning of “group visually by itemId” specified (group header behavior, sub-rows, or a single aggregated row) and does it match FR-020’s aggregation requirement? [Ambiguity, Spec §Clarifications, Spec §FR-020]

## Requirement Consistency

- [x] CHK017 Are the published chest file path requirements consistent between the index (relative `file` path) and the chest loader requirement (`chest_[name].json` or index-provided path)? [Consistency, Spec §FR-008, Spec §Published Data Shape]
- [x] CHK018 Are the “Published Level Shape” requirements consistent about the roll field nesting (e.g., `roll: {min,max}` vs `{ roll: { min, max } }`), so the UI contract is not ambiguous? [Conflict, Spec §Published Level Shape, Spec §Published Data Shape]
- [x] CHK019 Are the “levels” semantics consistent throughout the document (segments with `[minLevel,maxLevel]` vs “level-indexed 0..100”) and are older phrases removed/clarified? [Consistency, Spec §Clarifications, Spec §FR-017, Spec §FR-017a]
- [x] CHK020 Are the Edge Case requirements consistent with the expectation math requirements (e.g., weight=0 handling does not contradict deterministic formulas)? [Consistency, Spec §Edge Cases, Spec §FR-022]

## Acceptance Criteria Quality

- [x] CHK021 Are success criteria written so they can be objectively verified without relying on “without errors” as an undefined condition? [Measurability, Spec §SC-001]
- [x] CHK022 Is SC-002 measurable (e.g., specifies which chest types/thresholds must demonstrate the behavior) rather than “for at least one chest type”? [Measurability, Spec §SC-002]
- [x] CHK023 Are the 0.5s responsiveness goals scoped and measurable (device class, dataset size, and what counts as “updates”)? [Ambiguity, Spec §SC-003, Spec §SC-003a, Spec §SC-003b]
- [x] CHK024 Are persistence success criteria specific about where settings persist (same browser profile), and what constitutes “restores the same values”? [Clarity, Spec §SC-004]

## Scenario Coverage

- [x] CHK025 Are requirements defined for first-visit behavior (no prior settings) including initial defaults for all controls? [Coverage, Spec §FR-004]
- [x] CHK026 Are requirements defined for alternate data scenarios: some index entries have `show=false`, missing `name`, or unexpected `type` values? [Coverage, Spec §FR-002, Spec §Published Data Shape]
- [x] CHK027 Are requirements defined for partial failure scenarios (one chest file fails to load while others succeed) and how the UI should degrade? [Gap, Spec §FR-002]

## Edge Case Coverage

- [x] CHK028 Are requirements defined for the behavior when pool weights sum to 0, including whether the UI should display 0s, hide rows, or show an explanatory message? [Clarity, Spec §Edge Cases]
- [x] CHK029 Are requirements defined for roll/count scaling outcomes that collapse ranges (e.g., floor makes `min==max`, or both become 0) and whether those are acceptable UX outputs? [Gap, Spec §FR-008c]
- [x] CHK030 Are requirements defined for extreme X values (1 and 10000) in terms of UI affordance (step size, typing, and display constraints) beyond the numeric bounds? [Gap, Spec §FR-004]

## Non-Functional Requirements (UX-facing)

- [x] CHK031 Are accessibility requirements specified for all interactive controls (labels, keyboard navigation, focus states, and table semantics) rather than only implied? [Gap, Spec §FR-004]
- [x] CHK032 Are there explicit requirements for perceivable status messaging (loading/error/empty) that are accessible (e.g., screen reader friendly), given data is fetched asynchronously? [Gap, Spec §FR-002]

## Dependencies & Assumptions

- [x] CHK033 Are dependencies on docs/ItemQuantity.md and docs/ItemRarity.md explicitly reconciled with the in-spec formulas (to prevent conflicting definitions)? [Assumption, Spec §Assumptions, Spec §FR-008b, Spec §FR-008c]
- [x] CHK034 Is the assumption about “label if available” backed by a stated data source, or is it an unstated dependency that should be documented? [Assumption, Spec §FR-003]

## Ambiguities & Conflicts

- [x] CHK035 Are there unresolved ambiguous terms like “kept in sync”, “render all index entries flagged for display”, and “group visually” that should be tightened with explicit rules/examples? [Ambiguity, Spec §FR-002, Spec §FR-004, Spec §Clarifications]
- [x] CHK036 Is the spec explicit about what is intentionally out of scope for UX (sorting, filtering, pagination), or should those exclusions be stated to prevent scope creep? [Gap]
