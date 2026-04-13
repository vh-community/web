import changelog from "virtual:changelog"
import { Link } from "@components/Link"

export function HomePage() {
	const latestEntry = changelog.entries[0]

	return (
		<div className="space-y-6">
			<section
				aria-labelledby="purpose"
				className="bg-black/45 p-5 backdrop-blur-sm sm:p-6"
			>
				<h2 id="purpose">What this site is</h2>
				<p className="mt-3 text-pretty leading-relaxed text-white/90 ">
					This website is a community-driven project aimed at creating useful
					tools and resources for players of the Vault Hunters modpack.
				</p>

				<p className="mt-4 border border-white/15 bg-black/30 p-3 leading-relaxed">
					<strong className="font-semibold">Unofficial:</strong> This website is
					community-driven and is not affiliated with or endorsed by the Vault
					Hunters team.
				</p>

				<p className="mt-4 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
					Based on{" "}
					<span className="font-semibold text-white/90">
						VH {changelog.vhVersion}
					</span>
				</p>
			</section>

			{latestEntry && (
				<section
					aria-labelledby="latest-changes"
					className="bg-black/30 p-5 backdrop-blur-sm sm:p-6"
				>
					<h3
						id="latest-changes"
						className="text-xl font-semibold text-white/80"
					>
						Latest Changes
					</h3>
					<p className="mt-1 text-white/50">
						{latestEntry.date} — {latestEntry.title}
					</p>

					<div className="mt-3 space-y-3">
						{latestEntry.sections.map((section) => (
							<div key={section.heading}>
								<h4 className="font-medium text-white/70">
									{section.heading}
								</h4>
								<ul className="mt-1 list-disc list-inside space-y-0.5 text-white/60">
									{section.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<Link
						href="/changelog"
						className="mt-4 inline-block text-gold/80 hover:text-gold transition-colors"
					>
						View full changelog →
					</Link>
				</section>
			)}
		</div>
	)
}
