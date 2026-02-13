import { useMemo, useState } from "react"
import type { ChestSection } from "./chestSection"
import { formatItemName } from "./useItem"

/**
 * Manages search state and filters sections by chest label/ID or item name/ID.
 * Space-separated terms are treated as OR: any term matching is enough.
 * When only items match (not the chest name), the section is included with
 * only the matching items.
 */
export function useChestSearch(sections: ChestSection[]) {
	const [searchQuery, setSearchQuery] = useState("")

	const filteredSections = useMemo(() => {
		const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)
		if (terms.length === 0) return sections

		const result: ChestSection[] = []

		for (const section of sections) {
			const chestLabel = section.chestLabel.toLowerCase()
			const chestId = section.chestId.toLowerCase()

			const chestMatches = terms.some(
				(t) => chestLabel.includes(t) || chestId.includes(t),
			)

			if (chestMatches) {
				result.push(section)
				continue
			}

			// Filter items whose ID or friendly name match any term
			const matchingItems = section.items.filter((item) => {
				const id = item.itemId.toLowerCase()
				const name = formatItemName(item.itemId).toLowerCase()
				return terms.some((t) => id.includes(t) || name.includes(t))
			})

			if (matchingItems.length > 0) {
				result.push({ ...section, items: matchingItems })
			}
		}

		return result
	}, [sections, searchQuery])

	return { searchQuery, setSearchQuery, filteredSections }
}
