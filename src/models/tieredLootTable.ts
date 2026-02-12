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
	weigth: number
	items: ItemPool[]
}

export interface ItemPool {
	id: string
	weight: number
	min: number
	max: number
}
