import { useMemo, useState } from "react"
import type { ChestSection } from "./chestSection"

/**
 * Manages search state and filters sections by chest label or ID.
 */
export function useChestSearch(sections: ChestSection[]) {
	const [searchQuery, setSearchQuery] = useState("")

	const filteredSections = useMemo(() => {
		if (!searchQuery.trim()) return sections
		const q = searchQuery.trim().toLowerCase()
		return sections.filter(
			(s) =>
				s.chestLabel.toLowerCase().includes(q) ||
				s.chestId.toLowerCase().includes(q),
		)
	}, [sections, searchQuery])

	return { searchQuery, setSearchQuery, filteredSections }
}
