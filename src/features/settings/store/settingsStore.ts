import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '@/shared/types/common.types'

interface SettingsState {
  theme: Theme
  autoLockTimeout: number // seconds, 0 = disabled
  clearClipboardAfter: number // seconds
  showPreviewPanel: boolean
  showSidebar: boolean
  compactMode: boolean
  language: string

  setTheme: (theme: Theme) => void
  setAutoLockTimeout: (seconds: number) => void
  setClearClipboardAfter: (seconds: number) => void
  togglePreviewPanel: () => void
  toggleSidebar: () => void
  toggleCompactMode: () => void
  setLanguage: (language: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      autoLockTimeout: 300,
      clearClipboardAfter: 30,
      showPreviewPanel: true,
      showSidebar: true,
      compactMode: false,
      language: 'de',

      setTheme: (theme) => set({ theme }),
      setAutoLockTimeout: (autoLockTimeout) => set({ autoLockTimeout }),
      setClearClipboardAfter: (clearClipboardAfter) => set({ clearClipboardAfter }),
      togglePreviewPanel: () => set((s) => ({ showPreviewPanel: !s.showPreviewPanel })),
      toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
      toggleCompactMode: () => set((s) => ({ compactMode: !s.compactMode })),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'vaultix-settings',
    }
  )
)
