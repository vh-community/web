import type {
	LevelPool,
	Range,
	TierName,
	TieredLootTableLevel,
} from "../../../models/tieredLootTable"
import { TIER_NAMES } from "../../../models/tieredLootTable"
import { scaleCountRange, scaleRollRange } from "./quantity"
import { computeEffectiveWeights, computePoolProbabilities } from "./rarity"

/**
 * Expected value of a uniform integer range [min, max].
 * E = (min + max) / 2
 */
export function expectedUniform(range: Range): number {
	return (range.min + range.max) / 2
}

/** Result of per-item expected value calculation for one tier occurrence. */
export interface ItemExpectation {
	/** Item id */
	itemId: string
	/** Tier this item appears in */
	tier: TierName
	/** Expected amount per single chest (before multiplying by X) */
	expectedPerChest: number
}

/**
 * Compute per-item expected values for a level segment.
 *
 * For each item in each tier:
 *   E[rolls] × P(pool) × P(item | pool) × E[count]
 *
 * Where:
 * - E[rolls] = expected value of the (quantity-scaled) roll range
 * - P(pool) = tier probability from rarity-adjusted weights
 * - P(item | pool) = item weight / sum of item weights in tier
 * - E[count] = expected value of the (quantity-scaled) count range
 *
 * If total weight of items in a pool is 0, all items get 0 expected (Edge Case).
 */
export function computeItemExpectations(
	segment: TieredLootTableLevel,
	itemRarityPct: number,
	itemQuantityPct: number,
): ItemExpectation[] {
	const effectiveWeights = computeEffectiveWeights(segment, itemRarityPct)
	const poolProbs = computePoolProbabilities(effectiveWeights)
	const scaledRoll = scaleRollRange(segment.rolls, itemQuantityPct)
	const eRolls = expectedUniform(scaledRoll)

	const results: ItemExpectation[] = []

	for (const tier of TIER_NAMES) {
		const pool = getPool(segment, tier)
		const pPool = poolProbs[tier]

		// Sum of item weights in this pool
		const totalItemWeight = pool.items.reduce(
			(sum, item) => sum + item.weight,
			0,
		)

		for (const item of pool.items) {
			const pItem = totalItemWeight > 0 ? item.weight / totalItemWeight : 0
			const scaledCount = scaleCountRange(item.count, itemQuantityPct)
			const eCount = expectedUniform(scaledCount)

			const expectedPerChest = eRolls * pPool * pItem * eCount

			results.push({
				itemId: item.id,
				tier,
				expectedPerChest: Number.isFinite(expectedPerChest)
					? expectedPerChest
					: 0,
			})
		}
	}

	return results
}

/** Get the pool for a given tier from a level segment. */
function getPool(segment: TieredLootTableLevel, tier: TierName): LevelPool {
	return segment[tier]
}
