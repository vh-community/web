import { Link } from "@components/Link"

/**
 * Reusable site footer component (FR-007).
 */
export function Footer() {
	return (
		<footer className="mx-auto w-full max-w-4xl px-4 pb-10 text-sm">
			<div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-white/80 sm:flex-row sm:items-center sm:justify-between">
				<p>Made by the community</p>
				<span className="hidden sm:inline">|</span>
				<p>
					Not affiliated with or endorsed by the{" "}
					<a
						href="https://vaulthunters.gg"
						target="_blank"
						rel="noopener noreferrer"
					>
						official Vault Hunters
					</a>{" "}
					team
				</p>
				<span className="hidden sm:inline">|</span>
				<a
					href="https://github.com/vh-community/web"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub repository
				</a>
				<span className="hidden sm:inline">|</span>
				<Link href="/privacy">Privacy Policy</Link>
			</div>
		</footer>
	)
}
