/**
 * Derive a friendly display label from a chest id.
 *
 * Rules:
 * - If id ends with "_chest", remove that suffix
 * - Title-case the remaining parts
 *
 * Examples:
 * - "gilded_chest" → "Gilded"
 * - "wooden_chest" → "Wooden"
 * - "enigma_chest" → "Enigma"
 */
export function formatChestLabel(chestId: string): string {
	const raw = chestId.endsWith("_chest")
		? chestId.slice(0, -"_chest".length)
		: chestId

	return raw
		.split("_")
		.map((word) =>
			word.length > 0 ? word[0].toUpperCase() + word.slice(1) : "",
		)
		.join(" ")
}
