interface ErrorStateProps {
	message?: string
}

/**
 * Displayed when an error occurs loading loot table data (FR-002c).
 * Uses role="alert" for screen reader accessibility.
 */
export function ErrorState({
	message = "Failed to load loot table data.",
}: ErrorStateProps) {
	return (
		<div
			role="alert"
			className="rounded-lg border border-red-500/30 bg-red-900/20 p-6 text-center text-sm text-red-300"
		>
			<p>{message}</p>
		</div>
	)
}
