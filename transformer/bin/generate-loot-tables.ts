import { generateChestLootTables } from "../loot_tables/chests.js"

const SOURCE_DIR = "the_vault/gen/1.0/loot_tables"
const OUTPUT_DIR = "public/data/loot_tables"

async function main() {
	console.log("Generating loot tables...")
	await generateChestLootTables(SOURCE_DIR, OUTPUT_DIR)
	console.log("Done.")
}

main().catch((err) => {
	console.error("Failed to generate loot tables:", err)
	process.exit(1)
})
