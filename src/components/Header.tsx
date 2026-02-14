import { Link } from "@components/Link"

export function Header() {
	return (
		<header className="flex items-center gap-3 px-4 py-6">
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
				<p className="text-2xl text-blue-500 font-bold uppercase text-balance leading-tight whitespace-nowrap">
					Vault Hunters Community
				</p>
				<p className="mt-1 text-sm text-white/80">
					Community resources and tools.
				</p>
			</div>
		</header>
	)
}
