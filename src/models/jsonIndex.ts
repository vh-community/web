// Used for indexing JSON files in the project, specifically under the `public/data` directory.
// Elements are sorted and should be displayed in the order they are added to the index.
export type JsonIndex = JsonIndexEntry[]

export type IndexId = string & { __brand__: "IndexId" }

export interface JsonIndexEntry {
	id: IndexId
	parentId?: IndexId
	type: JsonIndexTypes
	file: string
}

export enum JsonIndexTypes {
	chest = "chest",
	chestAddon = "chest_addon",
}
