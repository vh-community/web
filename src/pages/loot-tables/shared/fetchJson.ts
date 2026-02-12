/**
 * Typed JSON fetch helper.
 * Fetches a URL and parses as JSON with basic error handling.
 */
export async function fetchJson<T>(url: string): Promise<T> {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${url}: ${response.status} ${response.statusText}`,
		)
	}
	return (await response.json()) as T
}
