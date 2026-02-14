import type { TierName } from "../../../models/tieredLootTable"

/**
 * Tier rarity visual treatment (FR-003a).
 * Returns Tailwind CSS class for translucent background by tier.
 *
 * Mapping:
 * - Common → Gray
 * - Rare → Blue
 * - Epic → Purple
 * - Omega → Green
 */
export const TIER_COLOR_CLASSES: Record<TierName, string> = {
	common: "text-white/80",
	rare: "text-blue-500/80",
	epic: "text-purple-500/80",
	omega: "text-green-500/80",
}

/** Human-readable tier labels for display (FR-003a: not color alone). */
export const TIER_LABELS: Record<TierName, string> = {
	common: "Common",
	rare: "Rare",
	epic: "Epic",
	omega: "Omega",
}
