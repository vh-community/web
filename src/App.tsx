import { useEffect, useState } from "react"
import { Background } from "./components/Background"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Navigation } from "./components/Navigation"
import { ChestsPage } from "./pages/loot-tables/chests/ChestsPage"

type Route = "home" | "loot-table-chests"

function getRoute(): Route {
	const hash = window.location.hash
	if (hash === "#/loot-table/chests") return "loot-table-chests"
	return "home"
}

function App() {
	const [route, setRoute] = useState<Route>(getRoute)

	useEffect(() => {
		const onHashChange = () => setRoute(getRoute())
		window.addEventListener("hashchange", onHashChange)
		return () => window.removeEventListener("hashchange", onHashChange)
	}, [])

	return (
		<div className="relative min-h-dvh text-white">
			<Background />
			<Header />
			<Navigation currentRoute={route} />

			<main className="mx-auto w-full max-w-4xl px-4 pb-12">
				{route === "home" && <HomePage />}
				{route === "loot-table-chests" && (
					<section
						aria-labelledby="chests-heading"
						className="rounded-xl bg-black/45 p-5 backdrop-blur-sm sm:p-6"
					>
						<ChestsPage />
					</section>
				)}
			</main>

			<Footer />
		</div>
	)
}

export default App

function HomePage() {
	return (
		<section
			aria-labelledby="purpose"
			className="rounded-xl bg-black/45 p-5 backdrop-blur-sm sm:p-6"
		>
			<h2 id="purpose" className="text-base font-semibold">
				What this site is
			</h2>
			<p className="mt-3 text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
				This site collects community-made resources for the Vault Hunters
				modpack in a simple, searchable format.
			</p>

			<p className="mt-4 rounded-lg border border-white/15 bg-black/30 p-3 text-sm leading-relaxed">
				<strong className="font-semibold">Unofficial:</strong> This website is
				community-driven and is not affiliated with or endorsed by the Vault
				Hunters team.
			</p>
		</section>
	)
}
