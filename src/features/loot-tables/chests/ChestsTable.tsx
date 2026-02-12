import { formatExpected } from "../shared/formatExpected"
import type { GroupedItem } from "./aggregateByItemId"
import { TIER_BG_CLASSES, TIER_LABELS } from "./tierStyles"

interface ChestSection {
	chestId: string
	chestLabel: string
	items: GroupedItem[]
}

interface ChestsTableProps {
	sections: ChestSection[]
}

/**
 * Table component showing grouped item rows with tier sub-rows (FR-003, FR-003a, FR-020).
 *
 * Columns: Chest, Item, Tier, Amount per X (FR-003).
 * Deterministic ordering (FR-020a):
 * - Chest sections in index order
 * - Items sorted by ascending item id
 * - Tier sub-rows: Common → Rare → Epic → Omega
 */
export function ChestsTable({ sections }: ChestsTableProps) {
	if (sections.length === 0) {
		return null
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b border-white/15 text-left text-xs uppercase tracking-wider text-white/60">
						<th scope="col" className="px-3 py-2">
							Chest
						</th>
						<th scope="col" className="px-3 py-2">
							Item
						</th>
						<th scope="col" className="px-3 py-2">
							Tier
						</th>
						<th scope="col" className="px-3 py-2 text-right">
							Amount per X
						</th>
					</tr>
				</thead>
				<tbody>
					{sections.map((section) => (
						<ChestSectionRows key={section.chestId} section={section} />
					))}
				</tbody>
			</table>
		</div>
	)
}

function ChestSectionRows({ section }: { section: ChestSection }) {
	let isFirstRow = true

	return (
		<>
			{section.items.map((item) => {
				return item.tiers.map((tierBreakdown, tierIdx) => {
					const showChestLabel = isFirstRow
					const showItemLabel = tierIdx === 0
					if (showChestLabel) {
						isFirstRow = false
					}

					return (
						<tr
							key={`${section.chestId}-${item.itemId}-${tierBreakdown.tier}`}
							className="border-b border-white/5"
						>
							{/* Chest column */}
							<td className="px-3 py-1.5 text-white/90">
								{showChestLabel ? section.chestLabel : ""}
							</td>

							{/* Item column — background based on lowest tier (FR-003a) */}
							<td
								className={`px-3 py-1.5 text-white/90 ${showItemLabel ? TIER_BG_CLASSES[item.lowestTier] : ""}`}
							>
								{showItemLabel ? item.itemId : ""}
							</td>

							{/* Tier column — background for this specific tier (FR-003a) */}
							<td
								className={`px-3 py-1.5 text-white/70 ${TIER_BG_CLASSES[tierBreakdown.tier]}`}
							>
								{TIER_LABELS[tierBreakdown.tier]}
							</td>

							{/* Amount per X — also with tier background */}
							<td
								className={`px-3 py-1.5 text-right tabular-nums text-white/90 ${TIER_BG_CLASSES[tierBreakdown.tier]}`}
							>
								{formatExpected(tierBreakdown.expectedPerX)}
							</td>
						</tr>
					)
				})
			})}
		</>
	)
}

export type { ChestSection }
