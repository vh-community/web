import { Link } from "@components/Link"
import type { NavItem } from "@components/nav/navItems"
import { navItems } from "@components/nav/navItems"
import { useEffect, useState } from "react"
import { useCurrentPath } from "../../hooks/useCurrentPath"

interface MobileMenuProps {
	isOpen: boolean
	onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
	const path = useCurrentPath()

	// Lock body scroll when the menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	// Close on Escape
	useEffect(() => {
		if (!isOpen) return
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [isOpen, onClose])

	return (
		<div
			className={`fixed inset-0 z-40 md:hidden transition-visibility ${
				isOpen ? "visible" : "invisible delay-300"
			}`}
			aria-hidden={!isOpen}
		>
			{/* Backdrop */}
			<button
				type="button"
				className={`absolute inset-0 bg-black/60 transition-opacity duration-300 cursor-default ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={onClose}
				aria-label="Close menu"
				tabIndex={-1}
			/>

			{/* Slide-in panel */}
			<nav
				className={`absolute inset-y-0 left-0 w-72 bg-gray-900/95 backdrop-blur-md shadow-2xl transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				aria-label="Mobile navigation"
			>
				{/* Top spacer matching header height */}
				<div className="h-16" />

				<div className="flex flex-col gap-1 px-4 py-4">
					{navItems.map((item) => (
						<MobileNavItem
							key={item.label}
							item={item}
							currentPath={path}
							onNavigate={onClose}
						/>
					))}
				</div>
			</nav>
		</div>
	)
}

interface MobileNavItemProps {
	item: NavItem
	currentPath: string
	onNavigate: () => void
}

function MobileNavItem({ item, currentPath, onNavigate }: MobileNavItemProps) {
	const [expanded, setExpanded] = useState(false)

	if (item.kind === "link") {
		const active = currentPath === item.href
		return (
			<Link
				href={item.href}
				className={`block rounded-md px-4 py-3 text-lg font-semibold uppercase tracking-wide transition-colors ${
					active
						? "bg-white/15 text-white"
						: "text-white/70 hover:bg-white/10 hover:text-white"
				}`}
				onClick={onNavigate}
			>
				{item.label}
			</Link>
		)
	}

	// Dropdown — tap to expand
	const childActive = item.children.some((child) => currentPath === child.href)

	return (
		<div>
			<button
				type="button"
				className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-lg font-semibold uppercase tracking-wide transition-colors ${
					childActive
						? "bg-white/15 text-white"
						: "text-white/70 hover:bg-white/10 hover:text-white"
				}`}
				onClick={() => setExpanded((v) => !v)}
				aria-expanded={expanded}
			>
				{item.label}
				<svg
					className={`h-5 w-5 transition-transform duration-200 ${
						expanded ? "rotate-180" : ""
					}`}
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

			{/* Expandable children */}
			<div
				className={`overflow-hidden transition-all duration-200 ${
					expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="ml-4 flex flex-col gap-1 border-l border-white/10 pl-3 pt-1 pb-1">
					{item.children.map((child) => (
						<Link
							key={child.href}
							href={child.href}
							className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
								currentPath === child.href
									? "bg-white/10 text-white"
									: "text-white/70 hover:bg-white/10 hover:text-white"
							}`}
							onClick={onNavigate}
						>
							{child.label}
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
