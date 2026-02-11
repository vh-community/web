# Data Model — Loot Table → Chests

This document describes the domain entities implied by specs/002-chest-loot-table/spec.md and the derived published JSON shapes used by the UI.

## Entities

### User Loot Settings (local)

- Storage: browser `localStorage`
- Fields:
  - `perXChests: number` (min 1, max 10000, default 100)
  - `level: number` (0–100)
  - `itemRarityPct: number` (0–300)
  - `itemQuantityPct: number` (0–300)

### Loot Table Index (published)

- File: `public/data/loot_tables/index.json`
- Shape (informative in spec): `{ id, type, name?, file, show }`
- Fields:
  - `id: string` (stable identifier, e.g., `gilded_chest`)
  - `type: string` (e.g., `chest`)
  - `name?: string` (optional display name)
  - `file: string` (relative path to chest JSON file)
  - `show: boolean` (whether to display in UI)

### Chest Loot Table (published)

- File: `public/data/loot_tables/chest_{id}.json`
- Shape: `{ id, levels: LevelSegment[] }`

#### LevelSegment

- `minLevel: number` (inclusive)
- `maxLevel: number` (inclusive)
- `roll: { min: number; max: number }` (uniform integer range)
- `common | rare | epic | omega: TierPool`

#### TierPool

- `weight: number` (tier selection weight; rarity modifier applies per FR-008b)
- `items: TierItem[]`

#### TierItem

- `id: string` (item identifier)
- `weight: number` (item selection weight within tier)
- `count: { min: number; max: number }` (uniform integer range; quantity modifier applies per FR-008c)

## Relationships / Usage

- Index entry `file` → fetches a Chest Loot Table.
- UI selects the LevelSegment where `minLevel <= level <= maxLevel`.
- UI computes expected values per item id by summing expected contributions across duplicate occurrences (FR-020).
