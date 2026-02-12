interface NavigationProps {
	currentRoute: string
}

/**
 * Reusable navigation component (FR-007).
 * Highlights the active route.
 */
export function Navigation({ currentRoute }: NavigationProps) {
	return (
		<nav
			className="mx-auto w-full max-w-4xl px-4 pb-4"
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-4 text-sm">
				<span className="font-medium text-white/60">Loot Table</span>
				<a
					href="#/loot-table/chests"
					className={`rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
						currentRoute === "loot-table-chests"
							? "bg-white/15 font-medium text-white"
							: "text-white/70 hover:bg-white/10 hover:text-white"
					}`}
				>
					Chests
				</a>
			</div>
		</nav>
	)
}
