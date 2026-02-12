import type { LevelSegment } from "../../../models/published_chest_loot_table"

/**
 * Select the applicable level segment for the given level (FR-008).
 * Level is clamped to [0, 100] before matching.
 * Returns the first segment where minLevel <= level <= maxLevel.
 * Returns undefined if no segment matches.
 */
export function selectLevelSegment(
	levels: LevelSegment[],
	level: number,
): LevelSegment | undefined {
	const clamped = Math.max(0, Math.min(100, Math.floor(level)))
	return levels.find(
		(seg) => clamped >= seg.minLevel && clamped <= seg.maxLevel,
	)
}
