import * as fs from "node:fs"
import * as path from "node:path"
import type { JsonIndex, JsonIndexEntry } from "../../src/models/jsonIndex"
import { JsonIndexTypes } from "../../src/models/jsonIndex"
import type {
	ItemPool,
	LevelPool,
	Range,
	TieredLootTable,
	TieredLootTableLevel,
} from "../../src/models/tieredLootTable"
import type { MinecraftLootTable, TierPoolEntry } from "./minecraftLootTable"

// Tier names in canonical order: the 4 pool entries map to these tiers
const TIER_NAMES = ["common", "rare", "epic", "omega"] as const

/**
 * Required display order for chest categories.
 * Chests whose id (after removing trailing _chest) matches one of these
 * appear in this order; unknown chests are appended alphabetically.
 */
const CHEST_CATEGORY_ORDER = [
	"wooden",
	"living",
	"gilded",
	"ornate",
	"hardened",
	"flesh",
	"enigma",
] as const

/**
 * Generate published chest loot tables from source VH loot tables.
 *
 * Rules:
 * - Scan sourceDir for files whose name contains "chest"
 * - Skip files ending with _raw.json
 * - Skip treasure_chest entirely (no file, no index entry)
 * - Consolidate level-threshold variants into a single output per chest type
 * - Output filenames: remove trailing _chest from the chest id, prefix with chest_
 *   e.g. gilded_chest → chest_gilded.json
 * - Emit index entries in display order (CHEST_CATEGORY_ORDER then alphabetical unknowns)
 */
export async function generateChestLootTables(
	sourceDir: string,
	outputDir: string,
	index: JsonIndex,
): Promise<void> {
	// Ensure output directory exists
	fs.mkdirSync(outputDir, { recursive: true })

	// Scan for chest files
	const allFiles = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".json"))
	const chestFiles = allFiles.filter((f) => f.includes("chest"))

	// Skip _raw.json files
	const filtered = chestFiles.filter((f) => !f.endsWith("_raw.json"))

	// Group by base chest id
	const grouped = groupByChestId(filtered)

	const entries: Array<{ chestId: string; entry: JsonIndexEntry }> = []

	for (const [chestId, files] of Object.entries(grouped)) {
		// Skip treasure_chest
		if (chestId === "treasure_chest") {
			console.log(`  Skipping: ${chestId} (excluded)`)
			continue
		}

		// Parse each variant and extract level threshold + loot data
		const variants: Array<{ minLevel: number; data: MinecraftLootTable }> = []

		for (const file of files) {
			const suffix = extractLevelSuffix(file)
			const rawContent = fs.readFileSync(path.join(sourceDir, file), "utf-8")
			const data = JSON.parse(rawContent) as MinecraftLootTable
			variants.push({ minLevel: suffix, data })
		}

		// Sort by minLevel ascending
		variants.sort((a, b) => a.minLevel - b.minLevel)

		// Build level segments
		const levels: TieredLootTableLevel[] = []
		for (let i = 0; i < variants.length; i++) {
			const variant = variants[i]
			const maxLevel =
				i < variants.length - 1 ? variants[i + 1].minLevel - 1 : 100

			const segment = transformToSegment(
				variant.data,
				variant.minLevel,
				maxLevel,
			)
			levels.push(segment)
		}

		// Concise file name: remove trailing _chest suffix
		const conciseKey = chestId.endsWith("_chest")
			? chestId.slice(0, -"_chest".length)
			: chestId
		const chestFileName = `chest_${conciseKey}.json`

		// Write chest file using TieredLootTable shape
		const chestTable: TieredLootTable = { name: chestId, levels }
		const chestFilePath = path.join(outputDir, chestFileName)
		fs.writeFileSync(chestFilePath, `${JSON.stringify(chestTable, null, 2)}\n`)
		console.log(`  Written: ${chestFileName}`)

		// Collect index entry
		entries.push({
			chestId,
			entry: {
				id: chestId,
				type: JsonIndexTypes.chest,
				file: chestFileName,
			},
		})
	}

	// Sort entries in display order
	const sorted = sortByDisplayOrder(entries)

	// Read index if it exists to preserve any existing values

	// Write index
	const addToIndex: JsonIndex = sorted.map((e) => e.entry)
	index.push(...addToIndex)
}

/**
 * Sort entries by display order:
 * 1. Known categories in CHEST_CATEGORY_ORDER
 * 2. Unknown categories alphabetically by chest id
 */
function sortByDisplayOrder(
	entries: Array<{ chestId: string; entry: JsonIndexEntry }>,
): Array<{ chestId: string; entry: JsonIndexEntry }> {
	return [...entries].sort((a, b) => {
		const aKey = getCategoryKey(a.chestId)
		const bKey = getCategoryKey(b.chestId)
		const aIdx = CHEST_CATEGORY_ORDER.indexOf(
			aKey as (typeof CHEST_CATEGORY_ORDER)[number],
		)
		const bIdx = CHEST_CATEGORY_ORDER.indexOf(
			bKey as (typeof CHEST_CATEGORY_ORDER)[number],
		)

		const aKnown = aIdx !== -1
		const bKnown = bIdx !== -1

		// Both known: sort by order
		if (aKnown && bKnown) return aIdx - bIdx
		// Known before unknown
		if (aKnown) return -1
		if (bKnown) return 1
		// Both unknown: alphabetical by id
		return a.chestId.localeCompare(b.chestId)
	})
}

/**
 * Get the category key from a chest id.
 * If id ends with _chest, remove that suffix.
 */
function getCategoryKey(chestId: string): string {
	return chestId.endsWith("_chest")
		? chestId.slice(0, -"_chest".length)
		: chestId
}

/**
 * Group files by their base chest id.
 * Pattern: {baseId}_{number}.json
 */
function groupByChestId(files: string[]): Record<string, string[]> {
	const groups: Record<string, string[]> = {}

	for (const file of files) {
		const baseName = file.replace(/\.json$/, "")
		// Match trailing _<number>
		const match = baseName.match(/^(.+)_(\d+)$/)
		if (!match) {
			console.warn(`  Skipping file with no numeric suffix: ${file}`)
			continue
		}

		const chestId = match[1]
		if (!groups[chestId]) {
			groups[chestId] = []
		}
		groups[chestId].push(file)
	}

	return groups
}

/**
 * Extract the level suffix number from a filename.
 * E.g., "gilded_chest_20.json" → 20
 */
function extractLevelSuffix(file: string): number {
	const baseName = file.replace(/\.json$/, "")
	const match = baseName.match(/_(\d+)$/)
	return match ? Number.parseInt(match[1], 10) : 0
}

/**
 * Transform a source loot table to a TieredLootTableLevel.
 */
function transformToSegment(
	data: MinecraftLootTable,
	minLevel: number,
	maxLevel: number,
): TieredLootTableLevel {
	const entry = data.entries[0]
	if (!entry) {
		return createEmptySegment(minLevel, maxLevel)
	}

	const rolls: Range = {
		min: entry.roll.min,
		max: entry.roll.max,
	}

	const level: Range = {
		min: minLevel,
		max: maxLevel,
	}

	// Map the 4 pool entries to the 4 tiers
	const tierPools: Record<string, LevelPool> = {}
	for (let i = 0; i < TIER_NAMES.length; i++) {
		const tierName = TIER_NAMES[i]
		const poolEntry: TierPoolEntry | undefined = entry.pool[i]

		if (poolEntry) {
			tierPools[tierName] = {
				weight: poolEntry.weight,
				items: poolEntry.pool.map(
					(itemEntry): ItemPool => ({
						id: itemEntry.item.id,
						weight: itemEntry.weight,
						count: {
							min: itemEntry.item.count.min,
							max: itemEntry.item.count.max,
						},
					}),
				),
			}
		} else {
			tierPools[tierName] = { weight: 0, items: [] }
		}
	}

	return {
		level,
		rolls,
		common: tierPools.common,
		rare: tierPools.rare,
		epic: tierPools.epic,
		omega: tierPools.omega,
	}
}

function createEmptySegment(
	minLevel: number,
	maxLevel: number,
): TieredLootTableLevel {
	const emptyPool: LevelPool = { weight: 0, items: [] }
	return {
		level: { min: minLevel, max: maxLevel },
		rolls: { min: 0, max: 0 },
		common: { ...emptyPool },
		rare: { ...emptyPool },
		epic: { ...emptyPool },
		omega: { ...emptyPool },
	}
}
