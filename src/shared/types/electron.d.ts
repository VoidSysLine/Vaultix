// Type declarations for Electron IPC bridge

interface ElectronAPI {
  getBackendUrl: () => Promise<string>
  openFileDialog: (options?: {
    title?: string
    filters?: { name: string; extensions: string[] }[]
  }) => Promise<string | null>
  saveFileDialog: (options?: {
    title?: string
    filters?: { name: string; extensions: string[] }[]
    defaultPath?: string
  }) => Promise<string | null>
  showMessageBox: (options: {
    type?: string
    buttons?: string[]
    title?: string
    message: string
    detail?: string
  }) => Promise<number>
  platform: string
  isElectron: boolean
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
    __vaultixIsDirty?: () => boolean
    __vaultixSave?: () => Promise<void>
  }
}

export {}
