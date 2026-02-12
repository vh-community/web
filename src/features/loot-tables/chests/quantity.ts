import type { UniformIntRange } from "../../../models/published_chest_loot_table"

/**
 * Apply Item Quantity scaling to roll and count ranges (FR-008c).
 *
 * For Item Quantity percentage q% (0–300%), multiplier m_q = 1 + q/100:
 * - minRoll = min(floor(minRoll * m_q), 54)
 * - maxRoll = min(floor(maxRoll * m_q), 54)
 * - minStack = floor(minStack * m_q)
 * - maxStack = floor(maxStack * m_q)
 */

export function scaleRollRange(
	roll: UniformIntRange,
	itemQuantityPct: number,
): UniformIntRange {
	const mq = 1 + itemQuantityPct / 100
	return {
		min: Math.min(Math.floor(roll.min * mq), 54),
		max: Math.min(Math.floor(roll.max * mq), 54),
	}
}

export function scaleCountRange(
	count: UniformIntRange,
	itemQuantityPct: number,
): UniformIntRange {
	const mq = 1 + itemQuantityPct / 100
	return {
		min: Math.floor(count.min * mq),
		max: Math.floor(count.max * mq),
	}
}
