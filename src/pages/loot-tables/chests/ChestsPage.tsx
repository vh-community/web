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

			{/* Search input & combine toggle */}
			<div className="mb-4">
				<div className="flex flex-col gap-2">
					<label className="flex items-center gap-2 cursor-pointer select-none text-white/80">
						<input
							type="checkbox"
							checked={settings.combineRollTiers}
							onChange={(e) =>
								setSettings({
									...settings,
									combineRollTiers: e.target.checked,
								})
							}
						/>
						Combine roll tiers
					</label>
					<div>
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
					</div>
				</div>
				<p className="text-sm sm:text-base text-white/50">
					Search for multiple items or chests by separating terms with spaces;
					results match if any term is found.
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
					combineRollTiers={settings.combineRollTiers}
				/>
			)}
		</FramedContent>
	)
}
