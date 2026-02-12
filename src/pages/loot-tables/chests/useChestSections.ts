import { useMemo } from "react"
import type { TieredLootTable } from "../../../models/tieredLootTable"
import { aggregateByItemId } from "./aggregateByItemId"
import type { ChestSection } from "./chestSection"
import { computeItemExpectations } from "./expectedValue"
import { formatChestLabel } from "./formatItemName"
import type { LootSettings } from "./lootSettings"
import { selectLevelSegment } from "./selectLevelSegment"
import type { ChestLoadResult } from "./useChestData"

/**
 * Computes per-chest sections with aggregated item expectations.
 * Memoized to avoid recalculation on every render.
 */
export function useChestSections(
	chestResults: ChestLoadResult[],
	settings: LootSettings,
): ChestSection[] {
	return useMemo(() => {
		return chestResults
			.filter((r) => r.data !== null)
			.map((result) => {
				const { entry, data } = result
				const table = data as TieredLootTable
				const segment = selectLevelSegment(table.levels, settings.level)
				const label = formatChestLabel(entry.id)

				if (!segment) {
					return {
						chestId: entry.id,
						chestLabel: label,
						items: [],
					}
				}

				const expectations = computeItemExpectations(
					segment,
					settings.itemRarityPct,
					settings.itemQuantityPct,
				)
				const grouped = aggregateByItemId(expectations, settings.perXChests)

				return {
					chestId: entry.id,
					chestLabel: label,
					items: grouped,
				}
			})
	}, [chestResults, settings])
}
