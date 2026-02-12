import { formatChestLabel } from "./formatItemName"
import type { ChestLoadResult } from "./useChestData"

interface ChestLoadErrorsProps {
	failedChests: ChestLoadResult[]
}

/**
 * Displays a warning for chests that failed to load.
 */
export function ChestLoadErrors({ failedChests }: ChestLoadErrorsProps) {
	if (failedChests.length === 0) return null

	return (
		<div
			role="alert"
			className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-3 text-sm text-yellow-300"
		>
			<p>
				Some chest data failed to load:{" "}
				{failedChests.map((r) => formatChestLabel(r.entry.id)).join(", ")}
			</p>
		</div>
	)
}
