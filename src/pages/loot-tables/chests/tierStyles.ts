import type { TierName } from "../../../models/tieredLootTable"
import { AddonGroups } from "../../../models/tieredLootTableAddon"

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
export const tierColorClasses: Record<TierName, string> = {
	common: "text-white/80",
	rare: "text-blue-500/80",
	epic: "text-purple-500/80",
	omega: "text-green-500/80",
}

/** Returns the color class for a tier, or a default for addon items (null tier). */
export function getTierColorClass(tier: TierName | null): string {
	if (tier === null) return "text-yellow-500/80"
	return tierColorClasses[tier]
}

/** Human-readable tier labels for display (FR-003a: not color alone). */
export const tierLabels: Record<TierName, string> = {
	common: "Common",
	rare: "Rare",
	epic: "Epic",
	omega: "Omega",
}

/** Tooltip descriptions for addon group names. */
export const addonGroupDescriptions: Record<AddonGroups, string> = {
	[AddonGroups.unmodified]: "Drops in unmodified vaults",
}
