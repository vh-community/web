import { Router } from "@components/Router"
import { Background } from "./components/Background"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"

function App() {
	return (
		<div className="relative min-h-dvh text-white">
			<Background />
			<Header />

			{/* Spacer for fixed header */}
			<div className="h-20 md:h-24" />

			<main className="mx-auto w-full max-w-7xl pb-12">
				<Router />
			</main>

			<Footer />
		</div>
	)
}

export default App
