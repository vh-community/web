/** Published loot table index entry (matches openapi.yaml LootTableIndexEntry). */
export interface LootTableIndexEntry {
	id: string
	type: string
	name?: string | null
	file: string
	show: boolean
}

/** Published loot table index (array of entries). */
export type LootTableIndex = LootTableIndexEntry[]

/** Uniform integer range {min, max} (inclusive). */
export interface UniformIntRange {
	min: number
	max: number
}

/** A single item within a tier pool. */
export interface TierItem {
	id: string
	weight: number
	count: UniformIntRange
}

/** A tier pool with its selection weight and item list. */
export interface TierPool {
	weight: number
	items: TierItem[]
}

/** A level segment within a chest loot table. */
export interface LevelSegment {
	minLevel: number
	maxLevel: number
	roll: UniformIntRange
	common: TierPool
	rare: TierPool
	epic: TierPool
	omega: TierPool
}

/** Published chest loot table (matches openapi.yaml ChestLootTable). */
export interface ChestLootTable {
	id: string
	levels: LevelSegment[]
}

/** Tier name constants in canonical order (Common < Rare < Epic < Omega). */
export const TIER_NAMES = ["common", "rare", "epic", "omega"] as const

export type TierName = (typeof TIER_NAMES)[number]
