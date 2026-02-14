export function Navigation() {
	const hash = window.location.hash

	return (
		<nav
			className="mx-auto w-full max-w-4xl px-4 pb-4"
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-4 text-xl">
				<a
					href="#/loot-table/chests"
					className={`rounded-md px-3 py-1.5 text-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
						hash === "#/loot-table/chests"
							? "bg-white/15 font-medium text-white"
							: "text-white/70 hover:bg-white/10 hover:text-white"
					}`}
				>
					Loot Table — Chests
				</a>
			</div>
		</nav>
	)
}
