import { useEffect, useState } from "react"
import { Background } from "./components/Background"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Navigation } from "./components/Navigation"
import { HomePage } from "./pages/HomePage"
import { ChestsPage } from "./pages/loot-tables/chests/ChestsPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"

function App() {
	return (
		<div className="relative min-h-dvh text-white">
			<Background />
			<Header />
			<Navigation />

			<main className="mx-auto w-full max-w-7xl px-4 pb-12">
				<Router />
			</main>

			<Footer />
		</div>
	)
}

function Router() {
	const hash = window.location.hash
	const strippedHash = hash.startsWith("#/") ? hash.slice(2) : hash
	const [route, setRoute] = useState<string>(strippedHash)

	useEffect(() => {
		const onHashChange = () => setRoute(strippedHash)
		window.addEventListener("hashchange", onHashChange)
		return () => window.removeEventListener("hashchange", onHashChange)
	}, [strippedHash])

	switch (route) {
		case "":
			return <HomePage />
		case "privacy":
			return <PrivacyPolicyPage />
		case "loot-table/chests":
			return <ChestsPage />
		default:
			window.location.hash = ""
	}

	return (
		<>
			{route === "home" && <HomePage />}
			{route === "privacy-policy" && <PrivacyPolicyPage />}
			{route === "loot-table-chests" && <ChestsPage />}
		</>
	)
}

export default App
