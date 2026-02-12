import { useCallback } from "react"
import type { LootSettings } from "./lootSettings"

interface ChestsControlsProps {
	settings: LootSettings
	onChange: (settings: LootSettings) => void
}

interface SliderNumberFieldProps {
	id: string
	label: string
	value: number
	min: number
	max: number
	step: number
	unit?: string
	onValueChange: (raw: string) => void
	onValueBlur: (raw: string) => void
}

function SliderNumberField({
	id,
	label,
	value,
	min,
	max,
	step,
	unit,
	onValueChange,
	onValueBlur,
}: SliderNumberFieldProps) {
	const labelId = `${id}-label`
	const sliderId = `${id}-slider`
	const fillPct = ((value - min) / (max - min)) * 100

	return (
		<div className="rounded-lg border border-white/10 bg-black/20 p-3">
			<div className="flex items-center justify-between gap-3">
				<label
					id={labelId}
					htmlFor={id}
					className="text-sm font-medium text-white/90"
				>
					{label}
				</label>

				<div className="flex items-center gap-1">
					<input
						type="number"
						id={id}
						min={min}
						max={max}
						step={step}
						value={value}
						onChange={(e) => onValueChange(e.target.value)}
						onBlur={(e) => onValueBlur(e.target.value)}
						className="no-spin w-24 rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-right text-sm tabular-nums text-white focus:border-[#ffa800]/50 focus:outline-none focus:ring-2 focus:ring-[#ffa800]/40"
					/>
					{unit ? (
						<span className="text-xs tabular-nums text-white/60">{unit}</span>
					) : null}
				</div>
			</div>

			<input
				type="range"
				id={sliderId}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onValueChange(e.target.value)}
				className="slider-gold mt-2 h-4 w-full cursor-pointer appearance-none rounded-full bg-white/10"
				style={{
					background: `linear-gradient(to right, var(--slider-gold) ${fillPct}%, rgba(255,255,255,0.1) ${fillPct}%)`,
				}}
				aria-labelledby={labelId}
			/>

			<div className="mt-1 flex justify-between text-xs tabular-nums text-white/40">
				<span>
					{min}
					{unit ?? ""}
				</span>
				<span>
					{max}
					{unit ?? ""}
				</span>
			</div>
		</div>
	)
}

/**
 * Settings controls for the Chests loot table page.
 * - Per X chests: slider + numeric text input, synced (min 1, max 10000, step 1)
 * - Level: slider + numeric text input, synced (min 0, max 100, step 1)
 * - Item Rarity: slider + numeric text input, synced (min 0, max 300, step 1)
 * - Item Quantity: slider + numeric text input, synced (min 0, max 300, step 1)
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
		<fieldset className="mb-6 rounded-xl border border-white/10 bg-black/15 p-4">
			<legend className="sr-only">Loot table settings</legend>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<SliderNumberField
					id="perXChests"
					label="Per X chests"
					value={settings.perXChests}
					min={1}
					max={10000}
					step={1}
					onValueChange={(raw) =>
						handleNumericChange("perXChests", 1, 10000, raw)
					}
					onValueBlur={(raw) => handleBlur("perXChests", 1, 10000, raw)}
				/>

				<SliderNumberField
					id="level"
					label="Level"
					value={settings.level}
					min={0}
					max={100}
					step={1}
					onValueChange={(raw) => handleNumericChange("level", 0, 100, raw)}
					onValueBlur={(raw) => handleBlur("level", 0, 100, raw)}
				/>

				<SliderNumberField
					id="itemRarity"
					label="Item Rarity"
					value={settings.itemRarityPct}
					min={0}
					max={300}
					step={1}
					unit="%"
					onValueChange={(raw) =>
						handleNumericChange("itemRarityPct", 0, 300, raw)
					}
					onValueBlur={(raw) => handleBlur("itemRarityPct", 0, 300, raw)}
				/>

				<SliderNumberField
					id="itemQuantity"
					label="Item Quantity"
					value={settings.itemQuantityPct}
					min={0}
					max={300}
					step={1}
					unit="%"
					onValueChange={(raw) =>
						handleNumericChange("itemQuantityPct", 0, 300, raw)
					}
					onValueBlur={(raw) => handleBlur("itemQuantityPct", 0, 300, raw)}
				/>
			</div>
		</fieldset>
	)
}
