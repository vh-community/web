import { Link } from "@components/Link"
import { DesktopNav } from "@components/nav/DesktopNav"
import { MobileMenu } from "@components/nav/MobileMenu"
import { MobileMenuButton } from "@components/nav/MobileMenuButton"
import { useCallback, useState } from "react"
import { useScrolled } from "../hooks/useScrolled"

export function Header() {
	const scrolled = useScrolled(50)
	const [menuOpen, setMenuOpen] = useState(false)

	const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])
	const closeMenu = useCallback(() => setMenuOpen(false), [])

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled
						? "bg-black/80 backdrop-blur-md shadow-lg py-2"
						: "bg-black/40 backdrop-blur-sm py-4"
				}`}
			>
				<div className="mx-auto flex max-w-7xl items-center gap-3 px-4">
					{/* Mobile hamburger — left side */}
					<MobileMenuButton isOpen={menuOpen} onToggle={toggleMenu} />

					{/* Logo */}
					<Link href="/" className="shrink-0">
						<img
							src="/vh-logo.png"
							width={44}
							height={44}
							alt="Vault Hunters Community logo"
							className={`shrink-0 transition-all duration-300 ${
								scrolled ? "h-8 w-8" : "h-11 w-11"
							}`}
						/>
					</Link>

					{/* Title — desktop full, mobile shows "Community" */}
					<div className="min-w-0">
						{/* Mobile: always show "Community" */}
						<p className="md:hidden text-lg text-gold font-bold uppercase leading-tight whitespace-nowrap">
							Community
						</p>

						{/* Desktop: full title + subtitle, collapses on scroll */}
						<div
							className={`hidden md:block transition-all duration-300 overflow-hidden ${
								scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
							}`}
						>
							<p className="text-2xl text-gold font-bold uppercase leading-tight whitespace-nowrap">
								Vault Hunters Community
							</p>
							<p className="mt-0.5 text-sm text-white/80">
								Community resources and tools.
							</p>
						</div>
					</div>

					{/* Spacer pushes nav to the right */}
					<div className="flex-1" />

					{/* Desktop navigation */}
					<DesktopNav />
				</div>
			</header>

			{/* Mobile slide-out menu */}
			<MobileMenu isOpen={menuOpen} onClose={closeMenu} />
		</>
	)
}
