/**
 * Reusable site footer component (FR-007).
 */
export default function Footer() {
	return (
		<footer className="mx-auto w-full max-w-4xl px-4 pb-10">
			<div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
				<p>Made by the community.</p>
				<a
					href="https://github.com/vh-community/web"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex w-fit items-center gap-2 text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
				>
					GitHub repository
				</a>
			</div>
		</footer>
	)
}
