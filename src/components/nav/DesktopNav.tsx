import { Link } from "@components/Link"
import type { NavItem } from "@components/nav/navItems"
import { navItems } from "@components/nav/navItems"
import { useCurrentPath } from "../../hooks/useCurrentPath"

function isActive(path: string, item: NavItem): boolean {
	if (item.kind === "link") return path === item.href
	return item.children.some((child) => path === child.href)
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
							className={`rounded-md px-3 py-1.5 text-lg font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
								active
									? "bg-white/15 text-white"
									: "text-white/70 hover:bg-white/10 hover:text-white"
							}`}
						>
							{item.label}
						</Link>
					)
				}

				// Dropdown item
				return (
					<div key={item.label} className="relative group">
						<button
							type="button"
							className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-lg font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
								active
									? "bg-white/15 text-white"
									: "text-white/70 hover:bg-white/10 hover:text-white"
							}`}
							aria-haspopup="true"
						>
							{item.label}
							<svg
								className="h-4 w-4 transition-transform group-hover:rotate-180"
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
						<div className="absolute left-0 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
							<div className="min-w-44 rounded-md bg-gray-900/95 backdrop-blur-md py-1 shadow-lg ring-1 ring-white/10">
								{item.children.map((child) => (
									<Link
										key={child.href}
										href={child.href}
										className={`block px-4 py-2 text-base font-medium transition-colors ${
											path === child.href
												? "bg-white/10 text-white"
												: "text-white/70 hover:bg-white/10 hover:text-white"
										}`}
									>
										{child.label}
									</Link>
								))}
							</div>
						</div>
					</div>
				)
			})}
		</nav>
	)
}
