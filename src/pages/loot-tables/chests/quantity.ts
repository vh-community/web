import type { Range } from "../../../models/tieredLootTable"

/**
 * Apply Item Quantity scaling to roll and count ranges for expected-value
 * calculations. The game uses stochastic rounding (each whole unit is
 * guaranteed and the fractional part is a probability of +1), so the
 * expected value equals the continuous product — no flooring.
 *
 * For Item Quantity percentage q% (0–300%), multiplier m_q = 1 + q/100:
 * - minRoll = min(minRoll * m_q, 54)
 * - maxRoll = min(maxRoll * m_q, 54)
 * - minStack = minStack * m_q
 * - maxStack = maxStack * m_q
 */

export function scaleRollRange(roll: Range, itemQuantityPct: number): Range {
	const mq = 1 + itemQuantityPct * 0.01
	return {
		min: Math.min(roll.min * mq, 54),
		max: Math.min(roll.max * mq, 54),
	}
}

export function scaleCountRange(count: Range, itemQuantityPct: number): Range {
	const mq = 1 + itemQuantityPct * 0.01
	return {
		min: count.min * mq,
		max: count.max * mq,
	}
}
