import { useCallback } from "react"

export interface LootSettings {
	perXChests: number
	level: number
	itemRarityPct: number
	itemQuantityPct: number
}

export const DEFAULT_SETTINGS: LootSettings = {
	perXChests: 100,
	level: 0,
	itemRarityPct: 0,
	itemQuantityPct: 0,
}

interface ChestsControlsProps {
	settings: LootSettings
	onChange: (settings: LootSettings) => void
}

/**
 * Settings controls for the Chests loot table page.
 * - Per X chests: slider + numeric text input, synced (min 1, max 10000, step 1)
 * - Level: numeric input 0–100
 * - Item Rarity: percentage input 0–300
 * - Item Quantity: percentage input 0–300
 *
 * All inputs have visible labels, consistent spacing, and keyboard accessibility.
 */
export function ChestsControls({ settings, onChange }: ChestsControlsProps) {
	const handleNumericChange = useCallback(
		(field: keyof LootSettings, min: number, max: number, raw: string) => {
			const parsed = Number.parseInt(raw, 10)
			if (!Number.isNaN(parsed)) {
				const clamped = Math.max(min, Math.min(max, parsed))
				onChange({ ...settings, [field]: clamped })
			}
		},
		[settings, onChange],
	)

	const handleBlur = useCallback(
		(field: keyof LootSettings, min: number, max: number, raw: string) => {
			const parsed = Number.parseInt(raw, 10)
			if (Number.isNaN(parsed) || raw.trim() === "") {
				// Revert to last valid value — no change needed since state holds the valid value
				return
			}
			const clamped = Math.max(min, Math.min(max, parsed))
			if (clamped !== settings[field]) {
				onChange({ ...settings, [field]: clamped })
			}
		},
		[settings, onChange],
	)

	return (
		<fieldset className="mb-6">
			<legend className="sr-only">Loot table settings</legend>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Per X chests */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="perXChests"
						className="text-sm font-medium text-white/90"
					>
						Per X chests
					</label>
					<div className="flex items-center gap-2">
						<input
							type="range"
							id="perXChests-slider"
							min={1}
							max={10000}
							step={1}
							value={settings.perXChests}
							onChange={(e) =>
								handleNumericChange("perXChests", 1, 10000, e.target.value)
							}
							className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-white"
							aria-label="Per X chests slider"
						/>
						<input
							type="number"
							id="perXChests"
							min={1}
							max={10000}
							step={1}
							value={settings.perXChests}
							onChange={(e) =>
								handleNumericChange("perXChests", 1, 10000, e.target.value)
							}
							onBlur={(e) => handleBlur("perXChests", 1, 10000, e.target.value)}
							className="w-20 rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
						/>
					</div>
				</div>

				{/* Level */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="level" className="text-sm font-medium text-white/90">
						Level
					</label>
					<input
						type="number"
						id="level"
						min={0}
						max={100}
						step={1}
						value={settings.level}
						onChange={(e) =>
							handleNumericChange("level", 0, 100, e.target.value)
						}
						onBlur={(e) => handleBlur("level", 0, 100, e.target.value)}
						className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
					/>
				</div>

				{/* Item Rarity */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="itemRarity"
						className="text-sm font-medium text-white/90"
					>
						Item Rarity (%)
					</label>
					<input
						type="number"
						id="itemRarity"
						min={0}
						max={300}
						step={1}
						value={settings.itemRarityPct}
						onChange={(e) =>
							handleNumericChange("itemRarityPct", 0, 300, e.target.value)
						}
						onBlur={(e) => handleBlur("itemRarityPct", 0, 300, e.target.value)}
						className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
					/>
				</div>

				{/* Item Quantity */}
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="itemQuantity"
						className="text-sm font-medium text-white/90"
					>
						Item Quantity (%)
					</label>
					<input
						type="number"
						id="itemQuantity"
						min={0}
						max={300}
						step={1}
						value={settings.itemQuantityPct}
						onChange={(e) =>
							handleNumericChange("itemQuantityPct", 0, 300, e.target.value)
						}
						onBlur={(e) =>
							handleBlur("itemQuantityPct", 0, 300, e.target.value)
						}
						className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30"
					/>
				</div>
			</div>
		</fieldset>
	)
}
