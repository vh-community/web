import type {
	LevelSegment,
	TierName,
} from "../../../models/published_chest_loot_table"
import { TIER_NAMES } from "../../../models/published_chest_loot_table"

/**
 * Compute effective pool weights after applying Item Rarity modifier (FR-008b).
 *
 * For Item Rarity percentage r% (0–300%), multiplier m_r = 1 + r/100:
 * - Common pool weight is unchanged
 * - Rare, Epic, Omega pool weights are multiplied by m_r
 *
 * Returns a record of tier -> effective weight.
 */
export function computeEffectiveWeights(
	segment: LevelSegment,
	itemRarityPct: number,
): Record<TierName, number> {
	const mr = 1 + itemRarityPct / 100

	return {
		common: segment.common.weight,
		rare: segment.rare.weight * mr,
		epic: segment.epic.weight * mr,
		omega: segment.omega.weight * mr,
	}
}

/**
 * Compute pool selection probabilities from effective weights (FR-008b).
 * If total weight is 0, all probabilities are 0.
 */
export function computePoolProbabilities(
	effectiveWeights: Record<TierName, number>,
): Record<TierName, number> {
	const totalWeight = TIER_NAMES.reduce(
		(sum, t) => sum + effectiveWeights[t],
		0,
	)

	if (totalWeight === 0) {
		return { common: 0, rare: 0, epic: 0, omega: 0 }
	}

	const result: Record<string, number> = {}
	for (const tier of TIER_NAMES) {
		result[tier] = effectiveWeights[tier] / totalWeight
	}
	return result as Record<TierName, number>
}
