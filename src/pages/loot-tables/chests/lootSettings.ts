export interface LootSettings {
	perXChests: number
	level: number
	itemRarityPct: number
	itemQuantityPct: number
}

export const DEFAULT_SETTINGS: LootSettings = {
	perXChests: 100,
	level: 0,
	itemRarityPct: 0,
	itemQuantityPct: 0,
}
