// Tiered Loot Table Addon is for adding loot after the main loot table rolls.
// This allows adding additional items to the loot without affecting the main loot table probabilities.
// Examples of this include the catalyst fragments from wooden chests or scavenger items from the scavenger vaults.

import type { ItemId } from "./item"
import type { IndexId } from "./jsonIndex"
export interface TieredLootTableAddon {
	id: IndexId
	levelRequirement: number
	group: AddonGroups
	items: TieredLootTableAddonItem[]
}

export interface TieredLootTableAddonItem {
	id: ItemId
	count: number
	rollChanges: {
		common: number
		rare: number
		epic: number
		omega: number
	}
}

export enum AddonGroups {
	unmodified = "unmodified",
}
