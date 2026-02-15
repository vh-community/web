import { FramedContent } from "@components/FramedContent"
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
		<FramedContent>
			<h1 id="chests-heading" className="mb-4">
				Loot Table — Chests
			</h1>

			<ChestsControls settings={settings} onChange={setSettings} />

			{/* Search input */}
			<div className="mb-4">
				<label htmlFor="chest-search" className="sr-only">
					Search chests or items
				</label>
				<input
					type="search"
					id="chest-search"
					placeholder="Search chests or items…"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full sm:max-w-xs"
				/>
				<p className="text-sm sm:text-base text-white/50">
					Search for multiple items or chests by separating terms with spaces;
					results match if any term is found.
				</p>
			</div>

			{/* Warning about missing catalyst fragments and calculations */}
			<div className="flex flex-col gap-4 mb-4 p-4 bg-yellow-900/30 border-l-4 border-yellow-500">
				<p className="text-sm sm:text-base text-yellow-300">
					⚠️ Wooden chest loot tables are missing catalyst fragment data. This
					will be resolved in a future update.
				</p>
				<p className="text-sm sm:text-base text-yellow-300">
					⚠️ Calculations have not been double-checked for accuracy and may be
					slightly off.
				</p>
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
					<EmptyState message="No chests or items match your search." />
				)}

			{/* Results table */}
			{!loading && !indexError && filteredSections.length > 0 && (
				<ChestsTable
					sections={filteredSections}
					perXChests={settings.perXChests}
				/>
			)}
		</FramedContent>
	)
}
