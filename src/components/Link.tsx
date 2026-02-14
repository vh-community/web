interface LinkProps {
	href: string
	children: React.ReactNode
	className?: string
}

export function Link({ href, children, className }: LinkProps) {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Allow browser defaults for external links and special keys
		if (href.startsWith("http") || e.ctrlKey || e.metaKey || e.shiftKey) {
			return
		}

		e.preventDefault()
		window.history.pushState(null, "", href)
		window.dispatchEvent(new PopStateEvent("popstate"))
	}

	return (
		<a href={href} onClick={handleClick} className={className}>
			{children}
		</a>
	)
}
