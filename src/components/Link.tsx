interface LinkProps {
	href: string
	children: React.ReactNode
	className?: string
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function Link({ href, children, className, onClick }: LinkProps) {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Allow browser defaults for external links and special keys
		if (href.startsWith("http") || e.ctrlKey || e.metaKey || e.shiftKey) {
			return
		}

		e.preventDefault()
		window.history.pushState(null, "", href)
		window.dispatchEvent(new PopStateEvent("popstate"))
		onClick?.(e)
	}

	return (
		<a href={href} onClick={handleClick} className={className}>
			{children}
		</a>
	)
}
