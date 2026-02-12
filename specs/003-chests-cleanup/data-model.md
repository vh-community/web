# Data Model: Chests Cleanup

This feature standardizes the data contracts for published loot-table JSON and the UI that consumes it.

## Entities

### JsonIndexEntry

Represents one published JSON file.

- **Source of truth**: `/home/senth/git/vh-community-web/src/models/jsonIndex.ts`
- **Used by**: generator (writes `public/data/loot_tables/index.json`), UI (loads index and then per-entry file)

Proposed shape:

```ts
export interface JsonIndex {
	id: string
	type: "chest"
	file: string
}
```

Notes:
- `name` / `show` are removed; UI derives a display label from `id`.

### TieredLootTable (Chest)

Represents a single chest loot table with multiple level segments.

- **Source of truth**: `/home/senth/git/vh-community-web/src/models/tieredLootTable.ts`
- **Used by**:
	- generator output: `public/data/loot_tables/chest_*.json`
	- UI calculations: expected value per tier/item

Contract shape (MUST match the existing TypeScript model; do not change it):

```ts
export interface TieredLootTable {
	name: string
	levels: TieredLootTableLevel[]
}

export interface TieredLootTableLevel {
	minLevel: number
	maxLevel: number
	common: LevelPool
	rare: LevelPool
	epic: LevelPool
	omega: LevelPool
}

export interface LevelPool {
	weight: number
	items: ItemPool[]
}

export interface ItemPool {
	id: string
	weight: number
	min: number
	max: number
}
```

Notes:

Validation rules (generator responsibility):
- `minLevel <= maxLevel`
- `min <= max` for each `ItemPool`
- All weights are non-negative numbers

## Derived/UX Entities

### Chest Category Order

Fixed ordering used only for rendering:

```ts
const CHEST_CATEGORY_ORDER = [
	"wooden",
	"living",
	"gilded",
	"ornate",
	"hardened",
	"flesh",
	"enigma",
] as const
```

Mapping rule:
- If `id` equals `<category>_chest`, map to that category.
- Unknown ids are uncategorized and appear after known categories.

### Item Display Name

Derived from an item id:
- Strip namespace prefix before `:`
- Split on `_`
- Title-case words and join with spaces
