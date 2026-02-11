/**
 * Types representing the Minecraft/VH source loot table JSON format.
 * Found in the_vault/gen/1.0/loot_tables/.
 */

export interface MinecraftLootTable {
	entries: LootTableEntry[]
}

export interface LootTableEntry {
	roll: UniformRoll
	pool: TierPoolEntry[]
}

export interface UniformRoll {
	type: string
	min: number
	max: number
}

export interface TierPoolEntry {
	weight: number
	pool: ItemEntry[]
}

export interface ItemEntry {
	weight: number
	item: ItemDefinition
}

export interface ItemDefinition {
	id: string
	count: UniformRoll
	nbt?: Record<string, unknown>
}
