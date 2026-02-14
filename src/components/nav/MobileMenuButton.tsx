interface MobileMenuButtonProps {
	isOpen: boolean
	onToggle: () => void
}

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
	return (
		<button
			type="button"
			className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
			onClick={onToggle}
			aria-label={isOpen ? "Close menu" : "Open menu"}
			aria-expanded={isOpen}
		>
			<span
				className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
					isOpen ? "translate-y-2 rotate-45" : ""
				}`}
			/>
			<span
				className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
					isOpen ? "opacity-0" : ""
				}`}
			/>
			<span
				className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
					isOpen ? "-translate-y-2 -rotate-45" : ""
				}`}
			/>
		</button>
	)
}
