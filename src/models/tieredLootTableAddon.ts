// Tiered Loot Table Addon is for adding loot after the main loot table rolls.
// This allows to add additional items to the loot without affecting the main loot table probabilities.
// Examples of this includes the catalyst fragments from wooden chests.

import type { ItemId } from "./item"
import type { IndexId } from "./jsonIndex"

// or scavenger items from the scavenger vaults.
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
