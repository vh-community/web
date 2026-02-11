import type { LootSettings } from "./ChestsControls"
import { DEFAULT_SETTINGS } from "./ChestsControls"

/**
 * Storage key and schema for persisted loot settings (FR-005, FR-005a).
 * Uses a single versioned localStorage key.
 */
const STORAGE_KEY = "vh.community.lootTables.chests.settings.v1"

/**
 * Clamp a numeric value into the given [min, max] range.
 * Returns the default if the value is not a finite number.
 */
function clampOrDefault(
	value: unknown,
	min: number,
	max: number,
	defaultValue: number,
): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return defaultValue
	}
	return Math.max(min, Math.min(max, Math.floor(value)))
}

/**
 * Load persisted settings from localStorage.
 * Returns defaults for any missing/invalid fields (FR-005).
 * Clamps values into valid ranges (FR-004, T031).
 */
export function loadSettings(): LootSettings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return DEFAULT_SETTINGS

		const parsed = JSON.parse(raw)
		if (typeof parsed !== "object" || parsed === null) return DEFAULT_SETTINGS

		return {
			perXChests: clampOrDefault(
				parsed.perXChests,
				1,
				10000,
				DEFAULT_SETTINGS.perXChests,
			),
			level: clampOrDefault(parsed.level, 0, 100, DEFAULT_SETTINGS.level),
			itemRarityPct: clampOrDefault(
				parsed.itemRarityPct,
				0,
				300,
				DEFAULT_SETTINGS.itemRarityPct,
			),
			itemQuantityPct: clampOrDefault(
				parsed.itemQuantityPct,
				0,
				300,
				DEFAULT_SETTINGS.itemQuantityPct,
			),
		}
	} catch {
		return DEFAULT_SETTINGS
	}
}

/**
 * Save settings to localStorage (FR-005).
 */
export function saveSettings(settings: LootSettings): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
	} catch {
		// localStorage may be full or unavailable — silently ignore
	}
}
