import { create } from 'zustand'
import type { KdbxGroup } from '@/shared/types/kdbx.types'

interface GroupsState {
  groups: KdbxGroup[]
  selectedGroupId: string | null
  expandedGroupIds: Set<string>

  setGroups: (groups: KdbxGroup[]) => void
  selectGroup: (id: string | null) => void
  toggleGroupExpanded: (id: string) => void
  expandGroup: (id: string) => void
  collapseGroup: (id: string) => void
}

export const useGroupsStore = create<GroupsState>((set) => ({
  groups: [],
  selectedGroupId: null,
  expandedGroupIds: new Set<string>(),

  setGroups: (groups) => set({ groups }),
  selectGroup: (selectedGroupId) => set({ selectedGroupId }),
  toggleGroupExpanded: (id) => set((state) => {
    const next = new Set(state.expandedGroupIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    return { expandedGroupIds: next }
  }),
  expandGroup: (id) => set((state) => {
    const next = new Set(state.expandedGroupIds)
    next.add(id)
    return { expandedGroupIds: next }
  }),
  collapseGroup: (id) => set((state) => {
    const next = new Set(state.expandedGroupIds)
    next.delete(id)
    return { expandedGroupIds: next }
  }),
}))
