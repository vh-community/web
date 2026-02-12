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
export const TIER_BG_CLASSES: Record<TierName, string> = {
	common: "bg-gray-500/15",
	rare: "bg-blue-500/15",
	epic: "bg-purple-500/15",
	omega: "bg-green-500/15",
}

/** Human-readable tier labels for display (FR-003a: not color alone). */
export const TIER_LABELS: Record<TierName, string> = {
	common: "Common",
	rare: "Rare",
	epic: "Epic",
	omega: "Omega",
}
