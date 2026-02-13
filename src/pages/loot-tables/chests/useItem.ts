// itemMap contains special items that need special mapping,
// such as gif items, or items that have changed names, but keep the same id.
const itemMap: Record<string, Item> = {
	"the_vault:carbon_nugget": {
		id: "the_vault:carbon_nugget",
		name: "Raw Carbon",
		iconUrl: "icons/the_vault_raw_carbon.png",
	},
	"the_vault:mod_box": {
		id: "the_vault:mod_box",
		name: "Mod Box",
		iconUrl: "icons/the_vault_mod_box.gif",
	},
	"the_vault:vault_essence": {
		id: "the_vault:vault_essence",
		name: "Vault Essence",
		iconUrl: "icons/the_vault_vault_essence.gif",
	},
	"the_vault:knowledge_star_essence": {
		id: "the_vault:knowledge_star_essence",
		name: "Knowledge Essence",
		iconUrl: "icons/the_vault_knowledge_essence.png",
	},
	"the_vault:vault_god_charm": {
		id: "the_vault:vault_god_charm",
		name: "Vault God Charm",
		iconUrl: "icons/the_vault_vault_god_charm.gif",
	},
	"the_vault:vault_moss": {
		id: "the_vault:vault_moss",
		name: "Vault Moss",
		iconUrl: "icons/the_vault_vault_moss.gif",
	},
	"the_vault:dreamstone": {
		id: "the_vault:dreamstone",
		name: "Dreamstone",
		iconUrl: "icons/the_vault_dreamstone.gif",
	},
	"the_vault:vault_diamond": {
		id: "the_vault:vault_diamond",
		name: "Vault Diamond",
		iconUrl: "icons/the_vault_vault_diamond.gif",
	},
	"the_vault:axe": {
		id: "the_vault:axe",
		name: "Axe",
		iconUrl: "icons/the_vault_vault_axe.gif",
	},
	"the_vault:boots": {
		id: "the_vault:boots",
		name: "Boots",
		iconUrl: "icons/the_vault_vault_boots.gif",
	},
	"the_vault:chestplate": {
		id: "the_vault:chestplate",
		name: "Chestplate",
		iconUrl: "icons/the_vault_vault_chestplate.gif",
	},
	"the_vault:helmet": {
		id: "the_vault:helmet",
		name: "Helmet",
		iconUrl: "icons/the_vault_vault_helmet.gif",
	},
	"the_vault:leggings": {
		id: "the_vault:leggings",
		name: "Leggings",
		iconUrl: "icons/the_vault_vault_leggings.gif",
	},
	"the_vault:shield": {
		id: "the_vault:shield",
		name: "Shield",
		iconUrl: "icons/the_vault_vault_shield.gif",
	},
	"the_vault:vault_necklace": {
		id: "the_vault:vault_necklace",
		name: "Vault Pendant",
		iconUrl: "icons/the_vault_vault_pendant.png",
	},
	"the_vault:wand": {
		id: "the_vault:wand",
		name: "Wand",
		iconUrl: "icons/the_vault_vault_wand.gif",
	},
}

export interface Item {
	id: string
	name: string
	iconUrl: string
}

export function useItem(itemId: string) {
	// For now, we only have special handling for a few items. In the future, we may want to fetch item data from an API or a local JSON file.
	return (
		itemMap[itemId] || {
			id: itemId,
			name: formatItemName(itemId), // Fallback to the ID as the name if we don't have a mapping
			iconUrl: `icons/${itemId.replace(":", "_")}.png`, // Fallback icon
		}
	)
}

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
