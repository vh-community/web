import * as fs from "node:fs"
import path from "node:path"
import type { JsonIndex } from "../../src/models/jsonIndex"
import { generateChestLootTables } from "../loot_tables/chests"
import { generateChestLootTableAddons } from "../loot_tables/chestsAddon"

const SOURCE_DIR = "the_vault/gen/1.0/loot_tables"
const OUTPUT_DIR = "public/data/loot_tables"

async function main() {
	console.log("Deleting existing loot tables...")
	fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })

	const index: JsonIndex = []

	console.log("Generating chest loot tables...")
	await generateChestLootTables(SOURCE_DIR, OUTPUT_DIR, index)
	console.log("Generating chest addon loot tables...")
	generateChestLootTableAddons(OUTPUT_DIR, index)

	// Index
	console.log("Writing index file")
	const indexPath = path.join(OUTPUT_DIR, "index.json")
	fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
	console.log(`  Written: index.json (${index.length} entries)`)
	console.log("Done.")
}

main().catch((err) => {
	console.error("Failed to generate loot tables:", err)
	process.exit(1)
})
