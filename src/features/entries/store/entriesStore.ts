import { create } from 'zustand'
import type { KdbxEntry } from '@/shared/types/kdbx.types'
import type { EntryFilter, SortConfig } from '@/shared/types/common.types'

interface EntriesState {
  entries: KdbxEntry[]
  selectedId: string | null
  filter: EntryFilter
  sort: SortConfig

  setEntries: (entries: KdbxEntry[]) => void
  selectEntry: (id: string | null) => void
  setFilter: (filter: Partial<EntryFilter>) => void
  setSort: (sort: SortConfig) => void
  addEntry: (entry: KdbxEntry) => void
  updateEntry: (id: string, updates: Partial<KdbxEntry>) => void
  removeEntry: (id: string) => void
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  selectedId: null,
  filter: { search: '', tags: [], group: null },
  sort: { field: 'title', direction: 'asc' },

  setEntries: (entries) => set({ entries }),
  selectEntry: (selectedId) => set({ selectedId }),
  setFilter: (partial) => set((state) => ({
    filter: { ...state.filter, ...partial },
  })),
  setSort: (sort) => set({ sort }),
  addEntry: (entry) => set((state) => ({
    entries: [...state.entries, entry],
  })),
  updateEntry: (id, updates) => set((state) => ({
    entries: state.entries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    ),
  })),
  removeEntry: (id) => set((state) => ({
    entries: state.entries.filter((e) => e.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),
}))
