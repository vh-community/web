import { Link } from "@components/Link"
import type { NavItem } from "@components/nav/navItems"
import { navItems } from "@components/nav/navItems"
import { useEffect, useRef, useState } from "react"
import { useCurrentPath } from "../../hooks/useCurrentPath"

function isActive(path: string, item: NavItem): boolean {
	if (item.kind === "link") return path === item.href
	return item.children.some((child) => path === child.href)
}

function DropdownMenu({
	item,
	active,
	path,
}: {
	item: Extract<NavItem, { kind: "dropdown" }>
	active: boolean
	path: string
}) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dropdownId = `dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!isOpen) return

		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [isOpen])

	// Focus first link when dropdown opens via keyboard
	useEffect(() => {
		if (isOpen && dropdownRef.current) {
			// Use requestAnimationFrame to ensure the dropdown is rendered before focusing
			requestAnimationFrame(() => {
				const firstLink = dropdownRef.current?.querySelector("a")
				firstLink?.focus()
			})
		}
	}, [isOpen])

	// Handle keyboard navigation
	function handleKeyDown(event: React.KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault()
			setIsOpen(false)
			buttonRef.current?.focus()
		} else if (event.key === "ArrowDown") {
			event.preventDefault()
			if (!isOpen) {
				setIsOpen(true)
			} else {
				// Move focus to next link
				const links = dropdownRef.current?.querySelectorAll("a")
				const currentIndex = links
					? Array.from(links).indexOf(
							document.activeElement as HTMLAnchorElement,
						)
					: -1
				if (links && currentIndex < links.length - 1) {
					links[currentIndex + 1]?.focus()
				}
			}
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			if (isOpen) {
				const links = dropdownRef.current?.querySelectorAll("a")
				const currentIndex = links
					? Array.from(links).indexOf(
							document.activeElement as HTMLAnchorElement,
						)
					: -1
				if (currentIndex > 0) {
					links?.[currentIndex - 1]?.focus()
				} else {
					// Close and return to button
					setIsOpen(false)
					buttonRef.current?.focus()
				}
			}
		}
	}

	function toggleDropdown() {
		setIsOpen(!isOpen)
	}

	return (
		<div key={item.label} className="relative" ref={dropdownRef}>
			<button
				ref={buttonRef}
				type="button"
				onClick={toggleDropdown}
				onKeyDown={handleKeyDown}
				className={`flex items-center gap-1 px-3 py-1.5 text-xl font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
					active
						? "text-gold shadow-[inset_0_-2px_0_0_currentColor]"
						: "text-gold/90 hover:text-gold"
				}`}
				aria-haspopup="true"
				aria-expanded={isOpen}
				aria-controls={dropdownId}
			>
				{item.label}
				<svg
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
						clipRule="evenodd"
					/>
				</svg>
			</button>

			{/* Dropdown panel */}
			{isOpen && (
				<div
					id={dropdownId}
					className="absolute left-0 top-full pt-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
				>
					<div className="min-w-44 bg-gray-900/95 backdrop-blur-md py-1 shadow-lg ring-1 ring-gold/10">
						{item.children.map((child) => (
							<Link
								key={child.href}
								href={child.href}
								className={`block px-4 py-2 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/80 ${
									path === child.href
										? "text-gold shadow-[inset_0_-2px_0_0_currentColor]"
										: "text-gold/90 hover:text-gold hover:shadow-[inset_0_-2px_0_0_currentColor]"
								}`}
								onClick={() => setIsOpen(false)}
							>
								{child.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export function DesktopNav() {
	const path = useCurrentPath()

	return (
		<nav
			className="hidden md:flex items-center gap-1"
			aria-label="Main navigation"
		>
			{navItems.map((item) => {
				const active = isActive(path, item)

				if (item.kind === "link") {
					return (
						<Link
							key={item.label}
							href={item.href}
							className={`px-3 py-1.5 text-xl font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/80 ${
								active
									? "text-gold shadow-[inset_0_-2px_0_0_currentColor]"
									: "text-gold/90 hover:text-gold hover:shadow-[inset_0_-2px_0_0_currentColor]"
							}`}
						>
							{item.label}
						</Link>
					)
				}

				// Dropdown item
				return (
					<DropdownMenu
						key={item.label}
						item={item}
						active={active}
						path={path}
					/>
				)
			})}
		</nav>
	)
}
