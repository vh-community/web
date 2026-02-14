export interface NavItemLink {
	kind: "link"
	label: string
	href: string
}

export interface NavItemDropdown {
	kind: "dropdown"
	label: string
	children: { label: string; href: string }[]
}

export type NavItem = NavItemLink | NavItemDropdown

export const navItems: NavItem[] = [
	{ kind: "link", label: "Home", href: "/" },
	{
		kind: "dropdown",
		label: "Loot Tables",
		children: [{ label: "Chests", href: "/loot-table/chests" }],
	},
]
