import { formatExpected } from "../shared/formatExpected"
import type { GroupedItem } from "./aggregateByItemId"
import { formatItemName } from "./formatItemName"
import { TIER_BG_CLASSES, TIER_LABELS } from "./tierStyles"

export interface ChestSection {
	chestId: string
	chestLabel: string
	items: GroupedItem[]
}

interface ChestsTableProps {
	sections: ChestSection[]
}

/**
 * Renders each chest as its own section with a visible header and a table
 * of item rows with tier sub-rows.
 *
 * Columns: Item, Tier, Amount per X.
 * Each chest section has its own heading and table.
 * Items display friendly names with raw id accessible via title attribute.
 * Tier background styling is preserved.
 */
export function ChestsTable({ sections }: ChestsTableProps) {
	if (sections.length === 0) {
		return null
	}

	return (
		<div className="space-y-6">
			{sections.map((section) => (
				<ChestSectionBlock key={section.chestId} section={section} />
			))}
		</div>
	)
}

function ChestSectionBlock({ section }: { section: ChestSection }) {
	return (
		<section aria-labelledby={`chest-${section.chestId}`}>
			<h3
				id={`chest-${section.chestId}`}
				className="mb-2 text-base font-semibold text-white/90"
			>
				{section.chestLabel}
			</h3>

			{section.items.length === 0 ? (
				<p className="text-sm text-white/50">No items at this level.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b border-white/15 text-left text-xs uppercase tracking-wider text-white/60">
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
							{section.items.map((item) => (
								<ItemRows
									key={item.itemId}
									item={item}
									chestId={section.chestId}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}

function ItemRows({ item, chestId }: { item: GroupedItem; chestId: string }) {
	const friendlyName = formatItemName(item.itemId)

	return (
		<>
			{item.tiers.map((tierBreakdown, tierIdx) => {
				const showItemLabel = tierIdx === 0

				return (
					<tr
						key={`${chestId}-${item.itemId}-${tierBreakdown.tier}`}
						className="border-b border-white/5"
					>
						{/* Item column — background based on lowest tier */}
						<td
							className={`px-3 py-1.5 text-white/90 ${showItemLabel ? TIER_BG_CLASSES[item.lowestTier] : ""}`}
							title={showItemLabel ? item.itemId : undefined}
							aria-label={showItemLabel ? item.itemId : undefined}
						>
							{showItemLabel ? friendlyName : ""}
						</td>

						{/* Tier column — background for this specific tier */}
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
			})}
		</>
	)
}
