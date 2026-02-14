import { Link } from "@components/Link"

/**
 * Reusable site header component (FR-006).
 * Contains logo + site title and description.
 */
export function Header() {
	return (
		<header className="mx-auto flex w-full max-w-4xl items-center gap-3 px-4 py-6">
			<Link href="/" className="shrink-0">
				<img
					src="/vh-logo.png"
					width={44}
					height={44}
					alt="Vault Hunters Community logo"
					className="h-11 w-11 shrink-0"
				/>
			</Link>
			<div className="min-w-0">
				<h1 className="text-balance leading-tight">
					<Link href="/" className="hover:underline">
						Vault Hunters Community
					</Link>
				</h1>
				<p className="mt-1 text-sm text-white/80">
					Community resources and tools.
				</p>
			</div>
		</header>
	)
}
