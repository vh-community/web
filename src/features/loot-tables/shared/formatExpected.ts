/**
 * Format an expected value for display.
 * Rules (FR-006a, FR-006b, FR-006c):
 * - Non-finite values display as "0"
 * - Round to nearest 0.01
 * - Up to 2 decimal places, trailing zeros trimmed
 */
export function formatExpected(value: number): string {
	if (!Number.isFinite(value)) {
		return "0"
	}
	// Round to nearest 0.01
	const rounded = Math.round(value * 100) / 100
	// Format with up to 2 decimals, trim trailing zeros
	return rounded.toFixed(2).replace(/\.?0+$/, "")
}
