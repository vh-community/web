import * as fs from "node:fs"
import type { ItemId } from "../../src/models/item"
import {
	type IndexId,
	type JsonIndex,
	JsonIndexTypes,
} from "../../src/models/jsonIndex"
import type { TieredLootTableAddon } from "../../src/models/tieredLootTableAddon"

export function generateChestLootTableAddons(
	outputDir: string,
	index: JsonIndex,
) {
	catalystFragmentsForWoodenChests(outputDir, index)
}

function catalystFragmentsForWoodenChests(outputDir: string, index: JsonIndex) {
	const addon: TieredLootTableAddon = {
		id: "chest_wooden_catalyst" as IndexId,
		levelRequirement: 20,
		items: [
			{
				id: "the_vault:vault_catalyst_fragment" as ItemId,
				count: 1,
				rollChanges: {
					common: 0.05,
					rare: 0.2,
					epic: 0.5,
					omega: 1,
				},
			},
		],
	}
	const id = "chest_wooden_catalyst"
	const addonFilePath = `${outputDir}/${id}.json`
	fs.writeFileSync(addonFilePath, `${JSON.stringify(addon, null, 2)}\n`)
	console.log(`  Written: ${id}.json`)

	index.push({
		id: id as IndexId,
		parentId: "chest_wooden" as IndexId,
		type: JsonIndexTypes.chestAddon,
		file: `${id}.json`,
	})
}
