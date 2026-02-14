export function HomePage() {
	return (
		<section
			aria-labelledby="purpose"
			className="rounded-xl bg-black/45 p-5 backdrop-blur-sm sm:p-6"
		>
			<h2 id="purpose">What this site is</h2>
			<p className="mt-3 text-pretty leading-relaxed text-white/90 ">
				This website is a community-driven project aimed at creating useful
				tools and resources for players of the Vault Hunters modpack.
			</p>

			<p className="mt-4 rounded-lg border border-white/15 bg-black/30 p-3 leading-relaxed">
				<strong className="font-semibold">Unofficial:</strong> This website is
				community-driven and is not affiliated with or endorsed by the Vault
				Hunters team.
			</p>
		</section>
	)
}
