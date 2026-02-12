export function Background() {
	return (
		<div
			className="fixed inset-0 z-0 pointer-events-none bg-[#1a1a1a] bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('/background.webp')" }}
		/>
	)
}
