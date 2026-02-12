import { useCallback, useEffect, useState } from "react"
import type { LootSettings } from "./ChestsControls"
import { loadSettings, saveSettings } from "./settingsStorage"

/**
 * Hook for managing loot settings with localStorage persistence (FR-005).
 * - Loads saved settings on mount
 * - Persists on every change
 */
export function useLootSettings() {
	const [settings, setSettings] = useState<LootSettings>(() => loadSettings())

	// Persist settings whenever they change
	useEffect(() => {
		saveSettings(settings)
	}, [settings])

	const updateSettings = useCallback((newSettings: LootSettings) => {
		setSettings(newSettings)
	}, [])

	return [settings, updateSettings] as const
}
