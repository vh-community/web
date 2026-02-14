import { Router } from "@components/Router"
import { Background } from "./components/Background"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Navigation } from "./components/Navigation"

function App() {
	return (
		<div className="relative min-h-dvh text-white">
			<Background />
			{/* Put the navigation to the right of the header on large screens, but below it on smaller screens */}
			<div className="flex flex-col justify-start sm:flex-row sm:items-center gap-4 lg:gap-8">
				<Header />
				<Navigation />
			</div>

			<main className="mx-auto w-full max-w-7xl pb-12">
				<Router />
			</main>

			<Footer />
		</div>
	)
}

export default App
