import { formatExpected } from "../shared/formatExpected"
import type { GroupedItem } from "./aggregateByItemId"
import type { ChestSection } from "./chestSection"
import { TIER_COLOR_CLASSES, TIER_LABELS } from "./tierStyles"
import { useItem } from "./useItem"

interface ChestsTableProps {
	sections: ChestSection[]
	perXChests: number
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
export function ChestsTable({ sections, perXChests }: ChestsTableProps) {
	if (sections.length === 0) {
		return null
	}

	return (
		<div className="space-y-6">
			{sections.map((section) => (
				<ChestSectionBlock
					key={section.chestId}
					section={section}
					perXChests={perXChests}
				/>
			))}
		</div>
	)
}

function ChestSectionBlock({
	section,
	perXChests,
}: {
	section: ChestSection
	perXChests: number
}) {
	return (
		<section aria-labelledby={`chest-${section.chestId}`}>
			<h3 id={`chest-${section.chestId}`} className="mb-2">
				<img
					src={`icons/the_vault_${section.chestId}.png`}
					alt=""
					className="inline h-12 w-12 object-contain mr-6"
				/>
				{section.chestLabel}
			</h3>

			{section.items.length === 0 ? (
				<p className="text-sm text-white/50">No items at this level.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-lg">
						<thead>
							<tr className="border-b border-white/15 text-left uppercase tracking-wider text-white/60">
								<th scope="col" colSpan={2} className="px-3 py-2">
									Item
								</th>
								<th scope="col" className="px-3 py-2">
									Tier
								</th>
								<th scope="col" className="px-3 py-2 text-right">
									Drops per {perXChests} chest{perXChests === 1 ? "" : "s"}
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
	const itemInfo = useItem(item.itemId)

	return (
		<>
			{item.tiers.map((tierBreakdown, tierIdx) => {
				const showItemLabel = tierIdx === 0

				return (
					<tr
						key={`${chestId}-${item.itemId}-${tierBreakdown.tier}`}
						className="border-b border-white/5"
					>
						{/* Item Icon - only on the first row for this item */}
						{showItemLabel ? (
							<td
								rowSpan={item.tiers.length}
								className={`p-1 text-white`}
								title={item.itemId}
								aria-label={item.itemId}
							>
								<img
									src={itemInfo.iconUrl}
									alt=""
									className="mx-auto h-10 w-10"
									onError={(e) => {
										;(e.target as HTMLImageElement).src =
											"icons/placeholder.gif"
									}}
								/>
							</td>
						) : (
							""
						)}
						{/* Item Name — background based on lowest tier */}
						{showItemLabel ? (
							<td
								rowSpan={item.tiers.length}
								className={`px-3 py-1.5 text-white`}
								title={showItemLabel ? item.itemId : undefined}
								aria-label={showItemLabel ? item.itemId : undefined}
							>
								{itemInfo.name}
							</td>
						) : (
							""
						)}

						{/* Tier column — background for this specific tier */}
						<td
							className={`px-3 py-1.5 ${TIER_COLOR_CLASSES[tierBreakdown.tier]}`}
						>
							{TIER_LABELS[tierBreakdown.tier]}
						</td>

						{/* Amount per X — also with tier background */}
						<td className={`px-3 py-1.5 text-right tabular-nums text-white`}>
							<ExpectedAmount value={tierBreakdown.expectedPerX} />
						</td>
					</tr>
				)
			})}
		</>
	)
}

function ExpectedAmount({ value }: { value: number }) {
	const str = formatExpected(value)
	// Split into integer and decimal parts to style them differently
	const [integerPart, decimalPart] = str.split(".")
	return (
		<span>
			<span>{integerPart}</span>
			{decimalPart !== undefined && (
				<span className="text-sm text-white/60">.{decimalPart}</span>
			)}
		</span>
	)
}
