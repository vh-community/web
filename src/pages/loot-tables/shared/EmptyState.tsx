interface EmptyStateProps {
	message?: string
}

/**
 * Displayed when no loot table data is available (FR-002b).
 */
export function EmptyState({
	message = "No loot table data available.",
}: EmptyStateProps) {
	return (
		<output className="block rounded-lg border border-white/10 bg-black/30 p-6 text-center text-sm text-white/70">
			<p>{message}</p>
		</output>
	)
}
