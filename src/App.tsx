function App() {
	return (
		<div className="min-h-dvh text-white">
			<header className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-6">
				<img
					src="/vh-logo.png"
					width={44}
					height={44}
					alt="Vault Hunters Community logo"
					className="h-11 w-11 shrink-0"
				/>
				<div className="min-w-0">
					<h1 className="text-balance text-xl font-semibold leading-tight sm:text-2xl">
						Vault Hunters Community
					</h1>
					<p className="mt-1 text-sm text-white/80">
						Community resources, guides, tools, and links.
					</p>
				</div>
			</header>

			<main className="mx-auto w-full max-w-4xl px-4 pb-12">
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
						<strong className="font-semibold">Unofficial:</strong> This website
						is community-driven and is not affiliated with or endorsed by the
						Vault Hunters team.
					</p>
				</section>
			</main>

			<footer className="mx-auto w-full max-w-4xl px-4 pb-10">
				<div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
					<p>Made by the community.</p>
					<a
						href="https://github.com/vh-community/web"
						target="_blank"
						rel="noreferrer"
						className="inline-flex w-fit items-center gap-2 text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
					>
						GitHub repository
					</a>
				</div>
			</footer>
		</div>
	)
}

export default App
