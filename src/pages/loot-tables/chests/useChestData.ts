import { useEffect, useState } from "react"
import type { JsonIndex, JsonIndexEntry } from "../../../models/jsonIndex"
import type { TieredLootTable } from "../../../models/tieredLootTable"
import { fetchJson } from "../shared/fetchJson"
import { TieredLootTableAddon } from "@models/tieredLootTableAddon"

const INDEX_URL = "/data/loot_tables/index.json"
const BASE_URL = "/data/loot_tables/"

export interface ChestLoadResult {
	entry: JsonIndexEntry
	chest: TieredLootTable | null
	addons: TieredLootTableAddon[]
	error: string | null
}

interface UseChestDataReturn {
	indexEntries: JsonIndexEntry[]
	chestResults: ChestLoadResult[]
	loading: boolean
	error: string | null
}

/**
 * Loads chest index and individual chest data files.
 * Defensively excludes treasure_chest from visible entries.
 */
export function useChestData(): UseChestDataReturn {
	const [indexEntries, setIndexEntries] = useState<JsonIndexEntry[]>([])
	const [chestResults, setChestResults] = useState<ChestLoadResult[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false

		async function loadData() {
			setLoading(true)
			setError(null)

			try {
				const index = await fetchJson<JsonIndex>(INDEX_URL)
				if (cancelled) return

				// Filter for chest type, exclude treasure
				const visible = index.filter(
					(entry) => entry.type === "chest" && entry.id !== "treasure_chest",
				)
				setIndexEntries(visible)

				// TODO: Add addons

				// Load individual chest files in parallel
				const results = await Promise.all(
					visible.map(async (entry): Promise<ChestLoadResult> => {
						try {
							const data = await fetchJson<TieredLootTable>(
								`${BASE_URL}${entry.file}`,
							)
							return { entry, chest: data, error: null }
						} catch (err) {
							return {
								entry,
								chest: null,
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
				setError(
					err instanceof Error
						? err.message
						: "Failed to load loot table index",
				)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		loadData()
		return () => {
			cancelled = true
		}
	}, [])

	return { indexEntries, chestResults, loading, error }
}
