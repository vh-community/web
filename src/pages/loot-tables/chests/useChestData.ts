import { useEffect, useState } from "react"
import type { JsonIndex, JsonIndexEntry } from "../../../models/jsonIndex"
import type { TieredLootTable } from "../../../models/tieredLootTable"
import type { TieredLootTableAddon } from "../../../models/tieredLootTableAddon"
import { fetchJson } from "../shared/fetchJson"

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

				// Collect addon entries grouped by parentId
				const addonEntries = index.filter(
					(entry) => entry.type === "chest_addon",
				)

				// Load all addon JSON files in parallel
				const addonResults = await Promise.all(
					addonEntries.map(async (entry) => {
						try {
							const data = await fetchJson<TieredLootTableAddon>(
								`${BASE_URL}${entry.file}`,
							)
							return { entry, addon: data }
						} catch {
							return { entry, addon: null }
						}
					}),
				)
				if (cancelled) return

				// Group loaded addons by parentId
				const addonsByParent = new Map<string, TieredLootTableAddon[]>()
				for (const { entry, addon } of addonResults) {
					if (addon && entry.parentId) {
						const existing = addonsByParent.get(entry.parentId) ?? []
						existing.push(addon)
						addonsByParent.set(entry.parentId, existing)
					}
				}

				// Load individual chest files in parallel
				const results = await Promise.all(
					visible.map(async (entry): Promise<ChestLoadResult> => {
						try {
							const data = await fetchJson<TieredLootTable>(
								`${BASE_URL}${entry.file}`,
							)
							const addons = addonsByParent.get(entry.id) ?? []
							return { entry, chest: data, addons, error: null }
						} catch (err) {
							return {
								entry,
								chest: null,
								addons: [],
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
