import type { GroupedItem } from "./aggregateByItemId"

export interface ChestSection {
	chestId: string
	chestLabel: string
	items: GroupedItem[]
}
