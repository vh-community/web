import { EmptyState } from "../shared/EmptyState"
import { ErrorState } from "../shared/ErrorState"
import { LoadingState } from "../shared/LoadingState"
import { ChestLoadErrors } from "./ChestLoadErrors"
import { ChestsControls } from "./ChestsControls"
import { ChestsTable } from "./ChestsTable"
import { useChestData } from "./useChestData"
import { useChestSearch } from "./useChestSearch"
import { useChestSections } from "./useChestSections"
import { useLootSettings } from "./useLootSettings"

/**
 * Chests loot table page.
 * Orchestrates data loading, settings, search, and table rendering.
 */
export function ChestsPage() {
	// Settings persistence
	const [settings, setSettings] = useLootSettings()

	// Data loading
	const {
		indexEntries,
		chestResults,
		loading,
		error: indexError,
	} = useChestData()

	// Compute sections from loaded data
	const sections = useChestSections(chestResults, settings)

	// Search functionality
	const { searchQuery, setSearchQuery, filteredSections } =
		useChestSearch(sections)

	// Failed chest tracking
	const failedChests = chestResults.filter((r) => r.error !== null)

	return (
		<div>
			<h2 id="chests-heading" className="mb-4 text-lg font-semibold">
				Loot Table — Chests
			</h2>

			<ChestsControls settings={settings} onChange={setSettings} />

			{/* Search input */}
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

			{/* Loading state */}
			{loading && <LoadingState />}

			{/* Index load error */}
			{!loading && indexError && <ErrorState message={indexError} />}

			{/* No data available */}
			{!loading && !indexError && indexEntries.length === 0 && (
				<EmptyState message="No chest loot table data available." />
			)}

			{/* Partial load failures */}
			{!loading && !indexError && (
				<ChestLoadErrors failedChests={failedChests} />
			)}

			{/* No search results */}
			{!loading &&
				!indexError &&
				sections.length > 0 &&
				filteredSections.length === 0 && (
					<EmptyState message="No chests match your search." />
				)}

			{/* Results table */}
			{!loading && !indexError && filteredSections.length > 0 && (
				<ChestsTable sections={filteredSections} />
			)}
		</div>
	)
}
