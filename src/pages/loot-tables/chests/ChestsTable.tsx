import { useState } from "react"
import { Tooltip } from "../../../components/Tooltip"
import { formatExpected } from "../shared/formatExpected"
import type { GroupedItem, TierBreakdown } from "./aggregateByItemId"
import type { ChestSection } from "./chestSection"
import { getItem } from "./getItem"
import { addonGroupDescriptions, getTierColorClass } from "./tierStyles"

interface ChestsTableProps {
	sections: ChestSection[]
	perXChests: number
	combineRollTiers: boolean
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
export function ChestsTable({
	sections,
	perXChests,
	combineRollTiers,
}: ChestsTableProps) {
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
					combineRollTiers={combineRollTiers}
				/>
			))}
		</div>
	)
}

function ChestSectionBlock({
	section,
	perXChests,
	combineRollTiers,
}: {
	section: ChestSection
	perXChests: number
	combineRollTiers: boolean
}) {
	return (
		<section aria-labelledby={`chest-${section.chestId}`}>
			<h2 id={`chest-${section.chestId}`} className="mb-2 mt-10">
				<img
					src={`/icons/the_vault_${section.chestId}.png`}
					alt=""
					className="inline h-10 w-10 sm:h-12 sm:w-12 object-contain ml-1 sm:ml-0 mr-4 sm:mr-6"
					onError={(e) => {
						;(e.target as HTMLImageElement).src = "/icons/placeholder.gif"
					}}
				/>
				{section.chestLabel}
			</h2>

			{section.items.length === 0 ? (
				<p className="text-white/50">No items at this level.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse sm:text-lg bg-black/20">
						<thead>
							<tr className="border-b border-white/15 text-left uppercase tracking-wider text-white/60">
								<th
									scope="col"
									colSpan={2}
									className="pl-2 pr-1 sm:px-3 py-1 sm:py-2"
								>
									Item
								</th>
								<th scope="col" className="px-1 sm:px-3 py-1 sm:py-2">
									Roll Tier
								</th>
								<th
									scope="col"
									className="pl-1 pr-2 sm:px-3 py-1 sm:py-2 text-right w-18 sm:w-auto"
								>
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
									combineRollTiers={combineRollTiers}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	)
}

function ItemRows({
	item,
	chestId,
	combineRollTiers,
}: {
	item: GroupedItem
	chestId: string
	combineRollTiers: boolean
}) {
	const itemInfo = getItem(item.itemId)
	const itemKey = `${chestId}-${item.itemId}`
	const [isHovered, setIsHovered] = useState(false)

	if (combineRollTiers) {
		return (
			<tr
				key={itemKey}
				className={`border-b border-white/5 ${isHovered ? "bg-white/5" : ""}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<td className="w-10 sm:w-12 text-white" title={item.itemId}>
					<img
						src={itemInfo.iconUrl}
						alt=""
						className="mx-auto h-8 w-8 sm:h-10 sm:w-10"
						onError={(e) => {
							;(e.target as HTMLImageElement).src = "/icons/placeholder.gif"
						}}
					/>
				</td>
				<td className="px-1 sm:px-3 text-white" title={item.itemId}>
					{itemInfo.name}
				</td>
				<td className="px-1 sm:px-3 h-12 sm:h-14">
					<CombinedTierInitials tiers={item.tiers} />
				</td>
				<td className="pl-1 pr-2 sm:px-3 text-right tabular-nums text-white">
					<ExpectedAmount value={item.totalExpectedPerX} />
				</td>
			</tr>
		)
	}

	return (
		<>
			{item.tiers.map((tierBreakdown, tierIdx) => {
				const showItemLabel = tierIdx === 0

				return (
					<tr
						key={`${itemKey}-${tierBreakdown.rollTierLabel}`}
						data-item-group={itemKey}
						className={`border-b border-white/5 ${isHovered ? "bg-white/5" : ""}`}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						{/* Item Icon - only on the first row for this item */}
						{showItemLabel ? (
							<td
								rowSpan={item.tiers.length}
								className={`w-10 sm:w-12 text-white`}
								title={item.itemId}
							>
								<img
									src={itemInfo.iconUrl}
									alt=""
									className="mx-auto h-8 w-8 sm:h-10 sm:w-10"
									onError={(e) => {
										;(e.target as HTMLImageElement).src =
											"/icons/placeholder.gif"
									}}
								/>
							</td>
						) : null}
						{/* Item Name — background based on lowest tier */}
						{showItemLabel ? (
							<td
								rowSpan={item.tiers.length}
								className={`px-1 sm:px-3 text-white`}
								title={item.itemId}
							>
								{itemInfo.name}
							</td>
						) : null}

						{/* Tier column — background for this specific tier */}
						<td
							className={`px-1 sm:px-3 h-12 sm:h-14 ${getTierColorClass(tierBreakdown.tier)}`}
						>
							<RollTierLabel breakdown={tierBreakdown} />
						</td>

						{/* Amount per X — also with tier background */}
						<td
							className={`pl-1 pr-2 sm:px-3 text-right tabular-nums text-white`}
						>
							<ExpectedAmount value={tierBreakdown.expectedPerX} />
						</td>
					</tr>
				)
			})}
		</>
	)
}

function CombinedTierInitials({ tiers }: { tiers: TierBreakdown[] }) {
	if (tiers.length === 1) {
		return (
			<span className={getTierColorClass(tiers[0].tier)}>
				{tiers[0].rollTierLabel}
			</span>
		)
	}
	return (
		<span>
			{tiers.map((t, i) => (
				<span key={t.rollTierLabel}>
					{i > 0 && <span className="text-white/40">, </span>}
					<span className={getTierColorClass(t.tier)}>
						{t.rollTierLabel.charAt(0)}
					</span>
				</span>
			))}
		</span>
	)
}

function RollTierLabel({ breakdown }: { breakdown: TierBreakdown }) {
	if (breakdown.addonGroup) {
		const description =
			addonGroupDescriptions[
				breakdown.addonGroup as keyof typeof addonGroupDescriptions
			]
		if (description) {
			return <Tooltip text={description}>{breakdown.rollTierLabel}</Tooltip>
		}
	}
	return <>{breakdown.rollTierLabel}</>
}

function ExpectedAmount({ value }: { value: number }) {
	const str = formatExpected(value)
	// Split into integer and decimal parts to style them differently
	const [integerPart, decimalPart] = str.split(".")
	return (
		<span>
			<span>{integerPart}</span>
			{decimalPart !== undefined && (
				<span className="text-base text-white/60">.{decimalPart}</span>
			)}
		</span>
	)
}
