import type { TierName } from "../../../models/tieredLootTable"
import { TIER_NAMES } from "../../../models/tieredLootTable"
import type { AddonItemExpectation } from "./computeAddonExpectations"
import type { ItemExpectation } from "./expectedValue"

/** A tier-level breakdown for a grouped item row. */
export interface TierBreakdown {
	tier: TierName | null
	/** Display label for the Roll Tier column (e.g., "Common" or "Unmodified") */
	rollTierLabel: string
	expectedPerX: number
}

/** A grouped item row with per-tier breakdown (FR-020). */
export interface GroupedItem {
	itemId: string
	/** Total expected across all tiers for this item */
	totalExpectedPerX: number
	/** The lowest tier this item appears in (for item identity background color - FR-003a). Null for addon-only items. */
	lowestTier: TierName | null
	/** Per-tier breakdown sub-rows (ordered Common → Rare → Epic → Omega, then addons) */
	tiers: TierBreakdown[]
}

/** Tier order index for sorting (FR-020a: Common < Rare < Epic < Omega). */
const TIER_ORDER: Record<TierName, number> = {
	common: 0,
	rare: 1,
	epic: 2,
	omega: 3,
}

/**
 * Aggregate item expectations by item id (FR-019, FR-020).
 * Items with the same id across tiers are grouped together.
 * Within each group, tier sub-rows are in canonical order.
 * Addon items appear after regular tier sub-rows.
 * Groups are sorted by ascending item id (FR-020a).
 *
 * @param expectations Per-item expectations from computeItemExpectations
 * @param addonExpectations Per-item expectations from computeAddonExpectations
 * @param perXChests Number of chests (X) to multiply by (FR-006)
 */
export function aggregateByItemId(
	expectations: ItemExpectation[],
	addonExpectations: AddonItemExpectation[],
	perXChests: number,
): GroupedItem[] {
	const map = new Map<
		string,
		{
			tiers: Map<TierName, number>
			addonTiers: { label: string; expected: number }[]
			lowestTier: TierName | null
		}
	>()

	for (const exp of expectations) {
		let entry = map.get(exp.itemId)
		if (!entry) {
			entry = { tiers: new Map(), addonTiers: [], lowestTier: exp.tier }
			map.set(exp.itemId, entry)
		}

		// Accumulate expected per tier (may have duplicate items within same tier)
		const current = entry.tiers.get(exp.tier) ?? 0
		entry.tiers.set(exp.tier, current + exp.expectedPerChest)

		// Track lowest tier (FR-003a)
		if (
			entry.lowestTier === null ||
			TIER_ORDER[exp.tier] < TIER_ORDER[entry.lowestTier]
		) {
			entry.lowestTier = exp.tier
		}
	}

	// Merge addon expectations
	for (const addon of addonExpectations) {
		let entry = map.get(addon.itemId)
		if (!entry) {
			entry = { tiers: new Map(), addonTiers: [], lowestTier: null }
			map.set(addon.itemId, entry)
		}
		const label = addon.group.charAt(0).toUpperCase() + addon.group.slice(1)
		entry.addonTiers.push({ label, expected: addon.expectedPerChest })
	}

	// Convert to sorted array
	const result: GroupedItem[] = []

	// Sort by ascending item id (FR-020a)
	const sortedIds = [...map.keys()].sort()

	for (const itemId of sortedIds) {
		const entry = map.get(itemId)
		if (!entry) continue
		const tiers: TierBreakdown[] = []

		// Tier sub-rows in canonical order (FR-020a)
		for (const tier of TIER_NAMES) {
			const value = entry.tiers.get(tier)
			if (value !== undefined && value > 0) {
				const label = tier.charAt(0).toUpperCase() + tier.slice(1)
				tiers.push({
					tier,
					rollTierLabel: label,
					expectedPerX: value * perXChests,
				})
			}
		}

		// Addon sub-rows after regular tiers
		for (const addonTier of entry.addonTiers) {
			if (addonTier.expected > 0) {
				tiers.push({
					tier: null,
					rollTierLabel: addonTier.label,
					expectedPerX: addonTier.expected * perXChests,
				})
			}
		}

		const totalExpectedPerX = tiers.reduce((sum, t) => sum + t.expectedPerX, 0)

		result.push({
			itemId,
			totalExpectedPerX,
			lowestTier: entry.lowestTier,
			tiers,
		})
	}

	return result
}
