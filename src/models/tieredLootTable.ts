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
	count: Range
}

/** Tier name constants in canonical order (Common < Rare < Epic < Omega). */
export const TIER_NAMES = ["common", "rare", "epic", "omega"] as const

export type TierName = (typeof TIER_NAMES)[number]
