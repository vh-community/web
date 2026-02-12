# Data Model: Chests Cleanup

This feature standardizes the data contracts for published loot-table JSON and the UI that consumes it.

## Entities

### JsonIndex / JsonIndexEntry

Represents one published JSON file.

- **Source of truth**: `/home/senth/git/vh-community-web/src/models/jsonIndex.ts`
- **Used by**: generator (writes `public/data/loot_tables/index.json`), UI (loads index and then per-entry file)

Proposed shape:

```ts
export type JsonIndex = JsonIndexEntry[]

export interface JsonIndexEntry {
	id: string
	type: "chest"
	file: string
}
```

Notes:
- `name` / `show` are removed; UI derives a display label from `id`.
- The order of entries in `JsonIndex` is significant: it defines the order chest sections are displayed.

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

export interface Range {
	min: number
	max: number
}

export interface TieredLootTableLevel {
	level: Range
	rolls: Range
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
	stackSize: Range
}
```

Notes:

Validation rules (generator responsibility):
- `level.min <= level.max` for each `TieredLootTableLevel`
- `rolls.min <= rolls.max` for each `TieredLootTableLevel`
- `stackSize.min <= stackSize.max` for each `ItemPool`
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

### Chest Display Order

Chest sections are rendered in the exact order they appear in `JsonIndex`.

The generator is responsible for emitting `index.json` entries in the required category order (and appending unknown chests after known categories in a stable order).

### Item Display Name

Derived from an item id:
- Strip namespace prefix before `:`
- Split on `_`
- Title-case words and join with spaces
