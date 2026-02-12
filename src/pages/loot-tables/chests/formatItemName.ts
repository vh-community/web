/**
 * Derive a friendly display name from a Minecraft-style item id.
 *
 * Rules:
 * - Strip namespace prefix before `:` when present
 * - Split on `_`
 * - Title-case words and join with spaces
 *
 * Examples:
 * - "minecraft:diamond_sword" → "Diamond Sword"
 * - "diamond_sword" → "Diamond Sword"
 * - "the_vault:vault_diamond" → "Vault Diamond"
 */
export function formatItemName(itemId: string): string {
	// Strip namespace prefix
	const colonIdx = itemId.indexOf(":")
	const raw = colonIdx >= 0 ? itemId.slice(colonIdx + 1) : itemId

	return raw
		.split("_")
		.map((word) =>
			word.length > 0 ? word[0].toUpperCase() + word.slice(1) : "",
		)
		.join(" ")
}

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
