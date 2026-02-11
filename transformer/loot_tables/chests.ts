import * as fs from "node:fs"
import * as path from "node:path"
import type { MinecraftLootTable, TierPoolEntry } from "./minecraftLootTable.js"

/**
 * Published types (matching src/models/published_chest_loot_table.ts).
 * Duplicated here to avoid cross-project imports.
 */
interface UniformIntRange {
	min: number
	max: number
}

interface TierItem {
	id: string
	weight: number
	count: UniformIntRange
}

interface TierPool {
	weight: number
	items: TierItem[]
}

interface LevelSegment {
	minLevel: number
	maxLevel: number
	roll: UniformIntRange
	common: TierPool
	rare: TierPool
	epic: TierPool
	omega: TierPool
}

interface ChestLootTable {
	id: string
	levels: LevelSegment[]
}

interface IndexEntry {
	id: string
	type: string
	name?: string
	file: string
	show: boolean
}

// Tier names in canonical order: the 4 pool entries map to these tiers
const TIER_NAMES = ["common", "rare", "epic", "omega"] as const

/**
 * Generate published chest loot tables from source VH loot tables.
 *
 * FR-009: Scan sourceDir for files whose name contains "chest".
 * FR-010: Skip files ending with _raw.json.
 * FR-011: Consolidate level-threshold variants into a single output per chest type.
 * FR-012: Derive level applicability from numeric suffix.
 * FR-013..FR-017a: Transform to the tiered segment model.
 * FR-016: Write one file per chest type.
 * FR-018: Write an index file.
 */
export async function generateChestLootTables(
	sourceDir: string,
	outputDir: string,
): Promise<void> {
	// Ensure output directory exists
	fs.mkdirSync(outputDir, { recursive: true })

	// FR-009: Scan for chest files
	const allFiles = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".json"))
	const chestFiles = allFiles.filter((f) => f.includes("chest"))

	// FR-010: Skip _raw.json files
	const filtered = chestFiles.filter((f) => !f.endsWith("_raw.json"))

	// Group by base chest id (FR-011)
	const grouped = groupByChestId(filtered)

	const index: IndexEntry[] = []

	for (const [chestId, files] of Object.entries(grouped)) {
		// Parse each variant and extract level threshold + loot data
		const variants: Array<{ minLevel: number; data: MinecraftLootTable }> = []

		for (const file of files) {
			const suffix = extractLevelSuffix(file, chestId)
			const rawContent = fs.readFileSync(path.join(sourceDir, file), "utf-8")
			const data = JSON.parse(rawContent) as MinecraftLootTable
			variants.push({ minLevel: suffix, data })
		}

		// Sort by minLevel ascending
		variants.sort((a, b) => a.minLevel - b.minLevel)

		// Build level segments (FR-012)
		const levels: LevelSegment[] = []
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

		// Write chest file (FR-016)
		const chestTable: ChestLootTable = { id: chestId, levels }
		const chestFileName = `chest_${chestId}.json`
		const chestFilePath = path.join(outputDir, chestFileName)
		fs.writeFileSync(chestFilePath, `${JSON.stringify(chestTable, null, 2)}\n`)
		console.log(`  Written: ${chestFileName}`)

		// Add to index (FR-018)
		index.push({
			id: chestId,
			type: "chest",
			file: chestFileName,
			show: true,
		})
	}

	// Sort index by id for stability
	index.sort((a, b) => a.id.localeCompare(b.id))

	// Write index (FR-018)
	const indexPath = path.join(outputDir, "index.json")
	fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
	console.log(`  Written: index.json (${index.length} entries)`)
}

/**
 * Group files by their base chest id.
 *
 * Examples:
 * - "gilded_chest_0.json" → "gilded_chest"
 * - "gilded_chest_20.json" → "gilded_chest"
 * - "gilded_chest_50.json" → "gilded_chest"
 *
 * The pattern is: {baseId}_{number}.json
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
 * E.g., "gilded_chest_20.json" with chestId "gilded_chest" → 20
 */
function extractLevelSuffix(file: string, _chestId: string): number {
	const baseName = file.replace(/\.json$/, "")
	const match = baseName.match(/_(\d+)$/)
	return match ? Number.parseInt(match[1], 10) : 0
}

/**
 * Transform a source loot table to a published level segment (FR-013..FR-015).
 *
 * Source format has:
 * - entries[0].roll → roll range
 * - entries[0].pool → 4 tier pools in order (common, rare, epic, omega)
 */
function transformToSegment(
	data: MinecraftLootTable,
	minLevel: number,
	maxLevel: number,
): LevelSegment {
	const entry = data.entries[0]
	if (!entry) {
		return createEmptySegment(minLevel, maxLevel)
	}

	const roll: UniformIntRange = {
		min: entry.roll.min,
		max: entry.roll.max,
	}

	// Map the 4 pool entries to the 4 tiers
	const tierPools: Record<string, TierPool> = {}
	for (let i = 0; i < TIER_NAMES.length; i++) {
		const tierName = TIER_NAMES[i]
		const poolEntry: TierPoolEntry | undefined = entry.pool[i]

		if (poolEntry) {
			tierPools[tierName] = {
				weight: poolEntry.weight,
				items: poolEntry.pool.map((itemEntry) => ({
					id: itemEntry.item.id,
					weight: itemEntry.weight,
					count: {
						min: itemEntry.item.count.min,
						max: itemEntry.item.count.max,
					},
				})),
			}
		} else {
			tierPools[tierName] = { weight: 0, items: [] }
		}
	}

	return {
		minLevel,
		maxLevel,
		roll,
		common: tierPools.common,
		rare: tierPools.rare,
		epic: tierPools.epic,
		omega: tierPools.omega,
	}
}

function createEmptySegment(minLevel: number, maxLevel: number): LevelSegment {
	const emptyPool: TierPool = { weight: 0, items: [] }
	return {
		minLevel,
		maxLevel,
		roll: { min: 0, max: 0 },
		common: { ...emptyPool },
		rare: { ...emptyPool },
		epic: { ...emptyPool },
		omega: { ...emptyPool },
	}
}
