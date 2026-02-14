import { HomePage } from "@pages/HomePage"
import { ChestsPage } from "@pages/loot-tables/chests/ChestsPage"
import { PrivacyPolicyPage } from "@pages/PrivacyPolicyPage"
import { useEffect, useState } from "react"

export function Router() {
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
			window.history.replaceState(null, "", "/")
			window.dispatchEvent(new PopStateEvent("popstate"))
			return null
	}
}
