import { Link } from "@components/Link"

export function Navigation() {
	const path = window.location.pathname

	return (
		<nav
			className="mx-auto w-full max-w-4xl px-4 pb-4"
			aria-label="Main navigation"
		>
			<div className="flex items-center gap-4 text-xl">
				<Link
					href="/loot-table/chests"
					className={`rounded-md px-3 py-1.5 text-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
						path === "/loot-table/chests"
							? "bg-white/15 font-medium text-white"
							: "text-white/70 hover:bg-white/10 hover:text-white"
					}`}
				>
					Loot Table — Chests
				</Link>
			</div>
		</nav>
	)
}
