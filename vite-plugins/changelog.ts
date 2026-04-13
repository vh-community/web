import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"
import type {
	Changelog,
	ChangelogEntry,
	ChangelogSection,
} from "../src/models/changelog"

const virtualModuleId = "virtual:changelog"
const resolvedVirtualModuleId = `\0${virtualModuleId}`

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export function changelogPlugin(): Plugin {
	const changelogPath = path.resolve(currentDir, "../CHANGELOG.md")

	return {
		name: "vite-plugin-changelog",

		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId
		},

		load(id) {
			if (id !== resolvedVirtualModuleId) return
			const raw = fs.readFileSync(changelogPath, "utf-8")
			const changelog = parseChangelog(raw)
			return `export default ${JSON.stringify(changelog)};`
		},

		handleHotUpdate({ file, server }) {
			if (path.resolve(file) === changelogPath) {
				const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
				if (mod) {
					server.moduleGraph.invalidateModule(mod)
					server.ws.send({ type: "full-reload" })
				}
			}
		},
	}
}

function parseChangelog(raw: string): Changelog {
	const lines = raw.split("\n")
	const entries: ChangelogEntry[] = []
	let currentEntry: ChangelogEntry | null = null
	let currentSection: ChangelogSection | null = null

	for (const line of lines) {
		// Match ## headings (entries)
		const entryMatch = line.match(/^## (\d{4}-\d{2}-\d{2})\s+(.+)/)
		if (entryMatch) {
			if (currentEntry) {
				if (currentSection) currentEntry.sections.push(currentSection)
				entries.push(currentEntry)
			}
			currentEntry = {
				date: entryMatch[1],
				title: entryMatch[2],
				sections: [],
			}
			currentSection = null
			continue
		}

		// Match ### headings (sections within an entry)
		const sectionMatch = line.match(/^### (.+)/)
		if (sectionMatch && currentEntry) {
			if (currentSection) currentEntry.sections.push(currentSection)
			currentSection = { heading: sectionMatch[1], items: [] }
			continue
		}

		// Match list items (top-level and indented)
		const itemMatch = line.match(/^(\s*)- (.+)/)
		if (itemMatch && currentSection) {
			currentSection.items.push(itemMatch[2])
			continue
		}

		// Match continuation lines (indented non-bullet lines that extend the previous item)
		const continuationMatch = line.match(/^ {2,}(?!- )(.+)/)
		if (
			continuationMatch &&
			currentSection &&
			currentSection.items.length > 0
		) {
			const lastIndex = currentSection.items.length - 1
			currentSection.items[lastIndex] += ` ${continuationMatch[1]}`
		}
	}

	// Push the last entry/section
	if (currentEntry) {
		if (currentSection) currentEntry.sections.push(currentSection)
		entries.push(currentEntry)
	}

	const vhVersion = extractVhVersion(entries)

	return { vhVersion, entries }
}

function extractVhVersion(entries: ChangelogEntry[]): string {
	for (const entry of entries) {
		const match = entry.title.match(/VH\s+([\d.]+)/)
		if (match) return match[1]
	}
	return "Unknown"
}
