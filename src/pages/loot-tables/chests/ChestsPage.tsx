import { useEffect, useMemo, useState } from "react"
import type { JsonIndex, JsonIndexEntry } from "../../../models/jsonIndex"
import type { TieredLootTable } from "../../../models/tieredLootTable"
import { EmptyState } from "../shared/EmptyState"
import { ErrorState } from "../shared/ErrorState"
import { fetchJson } from "../shared/fetchJson"
import { LoadingState } from "../shared/LoadingState"
import { aggregateByItemId } from "./aggregateByItemId"
import { ChestsControls } from "./ChestsControls"
import type { ChestSection } from "./ChestsTable"
import { ChestsTable } from "./ChestsTable"
import { computeItemExpectations } from "./expectedValue"
import { formatChestLabel } from "./formatItemName"
import { selectLevelSegment } from "./selectLevelSegment"
import { useLootSettings } from "./useLootSettings"

const INDEX_URL = "/data/loot_tables/index.json"
const BASE_URL = "/data/loot_tables/"

interface ChestLoadResult {
	entry: JsonIndexEntry
	data: TieredLootTable | null
	error: string | null
}

/**
 * Chests loot table page.
 * Renders per-chest sections in the order defined by the JsonIndex.
 * Includes search, settings controls, and defensive Treasure exclusion.
 */
export function ChestsPage() {
	const [settings, setSettings] = useLootSettings()
	const [indexEntries, setIndexEntries] = useState<JsonIndexEntry[]>([])
	const [chestResults, setChestResults] = useState<ChestLoadResult[]>([])
	const [loading, setLoading] = useState(true)
	const [indexError, setIndexError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState("")

	// Load index and chest data
	useEffect(() => {
		let cancelled = false

		async function loadData() {
			setLoading(true)
			setIndexError(null)

			try {
				const index = await fetchJson<JsonIndex>(INDEX_URL)
				if (cancelled) return

				// Filter for type: "chest" and defensively exclude treasure
				const visible = index.filter(
					(entry) => entry.type === "chest" && entry.id !== "treasure_chest",
				)
				setIndexEntries(visible)

				// Load each chest file
				const results = await Promise.all(
					visible.map(async (entry): Promise<ChestLoadResult> => {
						try {
							const data = await fetchJson<TieredLootTable>(
								`${BASE_URL}${entry.file}`,
							)
							return { entry, data, error: null }
						} catch (err) {
							// Partial failure — show remaining results
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

	// Compute table sections (memoized for performance)
	const sections: ChestSection[] = useMemo(() => {
		return chestResults
			.filter((r) => r.data !== null)
			.map((result) => {
				const { entry, data } = result
				const table = data as TieredLootTable
				const segment = selectLevelSegment(table.levels, settings.level)

				const label = formatChestLabel(entry.id)

				if (!segment) {
					return {
						chestId: entry.id,
						chestLabel: label,
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
					chestLabel: label,
					items: grouped,
				}
			})
	}, [chestResults, settings])

	// Apply search filter
	const filteredSections = useMemo(() => {
		if (!searchQuery.trim()) return sections
		const q = searchQuery.trim().toLowerCase()
		return sections.filter(
			(s) =>
				s.chestLabel.toLowerCase().includes(q) ||
				s.chestId.toLowerCase().includes(q),
		)
	}, [sections, searchQuery])

	// Collect errors for inline display
	const failedChests = chestResults.filter((r) => r.error !== null)

	return (
		<div>
			<h2 id="chests-heading" className="mb-4 text-lg font-semibold">
				Loot Table — Chests
			</h2>

			<ChestsControls settings={settings} onChange={handleSettingsChange} />

			{/* Search */}
			<div className="mb-4">
				<label htmlFor="chest-search" className="sr-only">
					Search chests
				</label>
				<input
					type="search"
					id="chest-search"
					placeholder="Search chests…"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 sm:max-w-xs"
				/>
			</div>

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
						{failedChests.map((r) => formatChestLabel(r.entry.id)).join(", ")}
					</p>
				</div>
			)}

			{!loading &&
				!indexError &&
				sections.length > 0 &&
				filteredSections.length === 0 && (
					<EmptyState message="No chests match your search." />
				)}

			{!loading && !indexError && filteredSections.length > 0 && (
				<ChestsTable sections={filteredSections} />
			)}
		</div>
	)
}
