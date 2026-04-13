export interface ChangelogSection {
	heading: string
	items: string[]
}

export interface ChangelogEntry {
	date: string
	title: string
	sections: ChangelogSection[]
}

export interface Changelog {
	vhVersion: string
	entries: ChangelogEntry[]
}
