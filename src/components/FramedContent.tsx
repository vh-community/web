export function FramedContent({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-black/45 p-5 bg-blur backdrop-blur-sm">{children}</div>
	)
}
