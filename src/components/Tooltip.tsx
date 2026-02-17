import { useCallback, useEffect, useRef, useState } from "react"

interface TooltipProps {
	text: string
	children: React.ReactNode
}

/**
 * Tooltip that shows on hover (desktop) and tap toggle (mobile).
 * Styled to match the app's window aesthetic: no rounded corners,
 * semi-transparent black background with gold ring.
 */
export function Tooltip({ text, children }: TooltipProps) {
	const [visible, setVisible] = useState(false)
	const containerRef = useRef<HTMLButtonElement>(null)

	// Close on outside click (mobile dismiss)
	useEffect(() => {
		if (!visible) return

		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setVisible(false)
			}
		}

		document.addEventListener("click", handleClickOutside)
		return () => document.removeEventListener("click", handleClickOutside)
	}, [visible])

	const handleClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setVisible((v) => !v)
	}, [])

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			setVisible((v) => !v)
		}
		if (e.key === "Escape") {
			setVisible(false)
		}
	}, [])

	return (
		<button
			ref={containerRef}
			type="button"
			className="relative cursor-help bg-transparent border-none p-0 font-inherit text-inherit text-left"
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{children}
			{visible && (
				<span
					role="tooltip"
					className="absolute bottom-full left-0 mb-1 z-50 whitespace-nowrap px-3 py-1.5 text-sm text-white bg-black/60 backdrop-blur-md shadow-lg ring-1 ring-gold/10"
				>
					{text}
				</span>
			)}
		</button>
	)
}
