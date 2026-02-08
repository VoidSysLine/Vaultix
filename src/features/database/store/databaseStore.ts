import { create } from 'zustand'
import type { KdbxDatabase } from '@/shared/types/kdbx.types'

interface DatabaseState {
  database: KdbxDatabase | null
  isLocked: boolean
  isDirty: boolean
  autoSave: boolean
  autoSaveInterval: number
  lastSaved: Date | null

  setDatabase: (db: KdbxDatabase | null) => void
  lock: () => void
  unlock: () => void
  markDirty: () => void
  markClean: () => void
  setAutoSave: (enabled: boolean) => void
  setAutoSaveInterval: (seconds: number) => void
  setLastSaved: (date: Date) => void
}

export const useDatabaseStore = create<DatabaseState>((set) => ({
  database: null,
  isLocked: true,
  isDirty: false,
  autoSave: true,
  autoSaveInterval: 30,
  lastSaved: null,

  setDatabase: (database) => set({ database, isLocked: database === null }),
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
  setAutoSave: (autoSave) => set({ autoSave }),
  setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
  setLastSaved: (lastSaved) => set({ lastSaved, isDirty: false }),
}))
