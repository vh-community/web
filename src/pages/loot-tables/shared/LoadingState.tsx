interface LoadingStateProps {
	message?: string
}

/**
 * Displayed while data is being loaded (FR-002a).
 * Uses role="status" for screen reader accessibility.
 */
export function LoadingState({
	message = "Loading loot table data…",
}: LoadingStateProps) {
	return (
		<output
			aria-live="polite"
			className="block rounded-lg border border-white/10 bg-black/30 p-6 text-center text-sm text-white/70"
		>
			<p>{message}</p>
		</output>
	)
}
