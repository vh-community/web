import changelog from "virtual:changelog"
import { FramedContent } from "@components/FramedContent"

export function ChangelogPage() {
	return (
		<FramedContent>
			<h1 className="text-4xl font-bold mb-2">Changelog</h1>
			<p className="text-sm text-white/50 mb-8">
				Based on VH {changelog.vhVersion}
			</p>

			<div className="space-y-10">
				{changelog.entries.map((entry) => (
					<article key={entry.date}>
						<h2 className="text-2xl font-semibold">{entry.title}</h2>
						<p className="mt-1 text-sm text-white/50">{entry.date}</p>

						<div className="mt-4 space-y-4">
							{entry.sections.map((section) => (
								<div key={section.heading}>
									<h3 className="text-lg font-medium text-white/80">
										{section.heading}
									</h3>
									<ul className="mt-2 list-disc list-inside space-y-1 text-white/70">
										{section.items.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</article>
				))}
			</div>
		</FramedContent>
	)
}
