import { useEffect, useState } from "react"

/**
 * Returns `true` once the page has been scrolled past the given threshold (in px).
 * Uses a passive scroll listener for performance.
 */
export function useScrolled(threshold = 50): boolean {
	const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > threshold)
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [threshold])

	return scrolled
}
