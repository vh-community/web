import { useMemo } from "react"
import type { TieredLootTable } from "../../../models/tieredLootTable"
import { aggregateByItemId } from "./aggregateByItemId"
import type { ChestSection } from "./chestSection"
import { computeAddonExpectations } from "./computeAddonExpectations"
import { computeItemExpectations } from "./expectedValue"
import { formatChestLabel } from "./formatItemName"
import type { LootSettings } from "./lootSettings"
import { selectLevelSegment } from "./selectLevelSegment"
import type { ChestLoadResult } from "./useChestData"

/**
 * Computes per-chest sections with aggregated item expectations.
 * Includes addon items (e.g., catalyst fragments) when level requirements are met.
 * Memoized to avoid recalculation on every render.
 */
export function useChestSections(
	chestResults: ChestLoadResult[],
	settings: LootSettings,
): ChestSection[] {
	return useMemo(() => {
		return chestResults
			.filter((r) => r.chest !== null)
			.map((result) => {
				const { entry, chest, addons } = result
				const table = chest as TieredLootTable
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
				const addonExpectations = computeAddonExpectations(
					addons,
					segment,
					settings.itemRarityPct,
					settings.level,
				)
				const grouped = aggregateByItemId(
					expectations,
					addonExpectations,
					settings.perXChests,
				)

				return {
					chestId: entry.id,
					chestLabel: label,
					items: grouped,
				}
			})
	}, [chestResults, settings])
}
