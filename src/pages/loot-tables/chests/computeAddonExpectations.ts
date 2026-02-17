import type {
	TieredLootTableLevel,
	TierName,
} from "../../../models/tieredLootTable"
import { TIER_NAMES } from "../../../models/tieredLootTable"
import type { TieredLootTableAddon } from "../../../models/tieredLootTableAddon"
import { computeEffectiveWeights, computePoolProbabilities } from "./rarity"

/** Result of addon expected value calculation. */
export interface AddonItemExpectation {
	itemId: string
	/** Addon group name (e.g., "unmodified") */
	group: string
	/** Expected amount per single chest (before multiplying by X) */
	expectedPerChest: number
}

/**
 * Compute expected values for addon items.
 *
 * For each addon item:
 *   Σ(P(tier) × rollChance[tier]) × count
 *
 * - P(tier) comes from the parent chest's rarity-adjusted tier probabilities
 * - rollChance[tier] is the addon's per-tier chance (e.g., 5% common, 100% omega)
 * - Item Quantity has NO effect on addon items (they bypass the loot table)
 *
 * Only includes addons where level >= addon.levelRequirement.
 */
export function computeAddonExpectations(
	addons: TieredLootTableAddon[],
	segment: TieredLootTableLevel,
	itemRarityPct: number,
	level: number,
): AddonItemExpectation[] {
	const effectiveWeights = computeEffectiveWeights(segment, itemRarityPct)
	const poolProbs = computePoolProbabilities(effectiveWeights)

	const results: AddonItemExpectation[] = []

	for (const addon of addons) {
		if (level < addon.levelRequirement) continue

		for (const item of addon.items) {
			// Weighted average chance across tiers
			let expectedChance = 0
			for (const tier of TIER_NAMES) {
				expectedChance += poolProbs[tier] * item.rollChanges[tier as TierName]
			}

			const expectedPerChest = expectedChance * item.count

			results.push({
				itemId: item.id,
				group: addon.group,
				expectedPerChest: Number.isFinite(expectedPerChest)
					? expectedPerChest
					: 0,
			})
		}
	}

	return results
}
