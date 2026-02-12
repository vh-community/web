// Used for indexing JSON files in the project, specifically under the `public/data` directory.
export interface JsonIndex {
	id: string
	type: JsonIndexTypes
	file: string
}

export enum JsonIndexTypes {
	chest = "chest",
}
