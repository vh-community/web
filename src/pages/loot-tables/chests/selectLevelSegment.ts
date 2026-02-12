import type { TieredLootTableLevel } from "../../../models/tieredLootTable"

/**
 * Select the applicable level segment for the given level.
 * Level is clamped to [0, 100] before matching.
 * Returns the first segment where level.min <= clamped <= level.max.
 * Returns undefined if no segment matches.
 */
export function selectLevelSegment(
	levels: TieredLootTableLevel[],
	level: number,
): TieredLootTableLevel | undefined {
	const clamped = Math.max(0, Math.min(100, Math.floor(level)))
	return levels.find(
		(seg) => clamped >= seg.level.min && clamped <= seg.level.max,
	)
}
