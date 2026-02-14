export function FramedContent({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-black/45 p-2 sm:p-5 sm:mx-5 backdrop-blur-sm">
			{children}
		</div>
	)
}
