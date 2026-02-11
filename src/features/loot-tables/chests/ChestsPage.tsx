import { useEffect, useMemo, useState } from "react"
import type {
	ChestLootTable,
	LootTableIndex,
	LootTableIndexEntry,
} from "../../../models/published_chest_loot_table"
import { EmptyState } from "../shared/EmptyState"
import { ErrorState } from "../shared/ErrorState"
import { LoadingState } from "../shared/LoadingState"
import { fetchJson } from "../shared/fetchJson"
import { ChestsControls } from "./ChestsControls"
import type { ChestSection } from "./ChestsTable"
import { ChestsTable } from "./ChestsTable"
import { aggregateByItemId } from "./aggregateByItemId"
import { computeItemExpectations } from "./expectedValue"
import { selectLevelSegment } from "./selectLevelSegment"
import { useLootSettings } from "./useLootSettings"

const INDEX_URL = "/data/loot_tables/index.json"
const BASE_URL = "/data/loot_tables/"

interface ChestLoadResult {
	entry: LootTableIndexEntry
	data: ChestLootTable | null
	error: string | null
}

/**
 * Chests loot table page (FR-001, FR-002, FR-003).
 */
export function ChestsPage() {
	const [settings, setSettings] = useLootSettings()
	const [indexEntries, setIndexEntries] = useState<LootTableIndexEntry[]>([])
	const [chestResults, setChestResults] = useState<ChestLoadResult[]>([])
	const [loading, setLoading] = useState(true)
	const [indexError, setIndexError] = useState<string | null>(null)

	// Load index and chest data (FR-002)
	useEffect(() => {
		let cancelled = false

		async function loadData() {
			setLoading(true)
			setIndexError(null)

			try {
				const index = await fetchJson<LootTableIndex>(INDEX_URL)
				if (cancelled) return

				// Filter for show: true and type: "chest" (FR-002d)
				const visible = index.filter(
					(entry) => entry.show && entry.type === "chest",
				)
				setIndexEntries(visible)

				// Load each chest file (FR-008)
				const results = await Promise.all(
					visible.map(async (entry): Promise<ChestLoadResult> => {
						try {
							const data = await fetchJson<ChestLootTable>(
								`${BASE_URL}${entry.file}`,
							)
							return { entry, data, error: null }
						} catch (err) {
							// FR-002c: partial failure — show remaining results
							return {
								entry,
								data: null,
								error:
									err instanceof Error
										? err.message
										: "Failed to load chest data",
							}
						}
					}),
				)

				if (cancelled) return
				setChestResults(results)
			} catch (err) {
				if (cancelled) return
				setIndexError(
					err instanceof Error
						? err.message
						: "Failed to load loot table index",
				)
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		loadData()
		return () => {
			cancelled = true
		}
	}, [])

	const handleSettingsChange = setSettings

	// Compute table sections (memoized for performance - SC-003/003a/003b, T026)
	const sections: ChestSection[] = useMemo(() => {
		return chestResults
			.filter((r) => r.data !== null)
			.map((result) => {
				const { entry, data } = result
				const table = data as ChestLootTable
				const segment = selectLevelSegment(table.levels, settings.level)

				if (!segment) {
					return {
						chestId: entry.id,
						chestLabel: entry.name || entry.id,
						items: [],
					}
				}

				const expectations = computeItemExpectations(
					segment,
					settings.itemRarityPct,
					settings.itemQuantityPct,
				)
				const grouped = aggregateByItemId(expectations, settings.perXChests)

				return {
					chestId: entry.id,
					chestLabel: entry.name || entry.id,
					items: grouped,
				}
			})
	}, [chestResults, settings])

	// Collect errors for inline display (FR-002c)
	const failedChests = chestResults.filter((r) => r.error !== null)

	return (
		<div>
			<h2 className="mb-4 text-lg font-semibold">Loot Table — Chests</h2>

			<ChestsControls settings={settings} onChange={handleSettingsChange} />

			{loading && <LoadingState />}

			{!loading && indexError && <ErrorState message={indexError} />}

			{!loading && !indexError && indexEntries.length === 0 && (
				<EmptyState message="No chest loot table data available." />
			)}

			{!loading && !indexError && failedChests.length > 0 && (
				<div
					role="alert"
					className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-3 text-sm text-yellow-300"
				>
					<p>
						Some chest data failed to load:{" "}
						{failedChests.map((r) => r.entry.name || r.entry.id).join(", ")}
					</p>
				</div>
			)}

			{!loading && !indexError && sections.length > 0 && (
				<ChestsTable sections={sections} />
			)}
		</div>
	)
}
