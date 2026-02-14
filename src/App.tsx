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
	const pathname = window.location.pathname
	const [route, setRoute] = useState<string>(pathname === "" ? "/" : pathname)

	useEffect(() => {
		const onPathChange = () => {
			const path = window.location.pathname
			setRoute(path === "" ? "/" : path)
		}

		window.addEventListener("popstate", onPathChange)
		return () => window.removeEventListener("popstate", onPathChange)
	}, [])

	switch (route) {
		case "/":
			return <HomePage />
		case "/privacy":
			return <PrivacyPolicyPage />
		case "/loot-table/chests":
			return <ChestsPage />
		default:
	}
}

export default App
