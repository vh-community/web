import { FramedContent } from "@components/FramedContent"

export function PrivacyPolicyPage() {
	return (
		<FramedContent>
			<h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
			<p className="text-sm text-gray-400 mb-8">Effective Date: January 2025</p>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-3">Introduction</h2>
				<p className="mb-4">
					This website is a community-driven project that provides tools and
					resources for players of the Vault Hunters modpack. We are committed
					to protecting your privacy and being transparent about how we handle
					your data.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-3">What Data We Collect</h2>
				<h3 className="text-xl font-medium mb-2">Local Storage Data</h3>
				<p className="mb-2">
					We store the following preferences locally in your browser using
					localStorage.
				</p>
				<ul className="list-disc list-inside mb-4 space-y-1">
					<li>
						<strong>Loot Table Settings:</strong>
						<ul className="list-disc list-inside ml-6 mt-1 space-y-1">
							<li>Level</li>
							<li>Item quantity preferences</li>
							<li>Item rarity filters</li>
							<li>Number of chests to display</li>
						</ul>
					</li>
				</ul>
				<p className="mb-4">
					This data is stored <strong>only on your device</strong> and is never
					transmitted to any server or third party.
				</p>

				<h3 className="text-xl font-medium mb-2">Data We Do NOT Collect</h3>
				<ul className="list-disc list-inside mb-4 space-y-1">
					<li>We do not collect personal information (name, email, etc.)</li>
					<li>We do not use cookies for tracking or analytics</li>
					<li>We do not use third-party analytics services</li>
					<li>We do not track your browsing behavior</li>
					<li>We do not share any data with third parties</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-3">How We Use Your Data</h2>
				<p className="mb-2">
					The settings stored in localStorage are used solely to:
				</p>
				<ul className="list-disc list-inside space-y-1">
					<li>Remember your preferences between visits</li>
					<li>
						Provide a personalized experience when using our loot table tools
					</li>
					<li>
						Enhance usability by preserving your filter and display settings
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-3">Your Control Over Data</h2>
				<p className="mb-2">You have full control over your data:</p>
				<ul className="list-disc list-inside space-y-1">
					<li>
						<strong>View Settings:</strong> Your current settings are visible in
						the UI
					</li>
					<li>
						<strong>Modify Settings:</strong> Change any preference at any time
						through the settings interface
					</li>
					<li>
						<strong>Delete Data:</strong> Clear your browser's localStorage to
						remove all stored preferences
					</li>
				</ul>
			</section>

			<p className="text-sm text-gray-400">
				This is a community project. If you have questions about this Privacy
				Policy, please open an issue on our GitHub repository.
			</p>
		</FramedContent>
	)
}
