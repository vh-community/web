import { useEffect, useState } from "react"

/**
 * Returns the current `window.location.pathname`, kept in sync with
 * pushState/popstate navigation used by the app's `<Link>` component.
 */
export function useCurrentPath(): string {
	const [path, setPath] = useState(() => window.location.pathname || "/")

	useEffect(() => {
		const onPathChange = () => {
			setPath(window.location.pathname || "/")
		}
		window.addEventListener("popstate", onPathChange)
		return () => window.removeEventListener("popstate", onPathChange)
	}, [])

	return path
}
