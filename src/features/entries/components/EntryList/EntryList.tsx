import { useMemo } from 'react'
import { Search, Plus, ArrowUpDown } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import { useGroupsStore } from '@/features/groups/store/groupsStore'
import { EntryItem } from './EntryItem'
import type { KdbxEntry } from '@/shared/types/kdbx.types'

interface EntryListProps {
  onNewEntry?: () => void
  onEditEntry?: (entry: KdbxEntry) => void
  onDeleteEntry?: (entryId: string) => void
}

export function EntryList({ onNewEntry }: EntryListProps) {
  const entries = useEntriesStore((s) => s.entries)
  const selectedId = useEntriesStore((s) => s.selectedId)
  const filter = useEntriesStore((s) => s.filter)
  const sort = useEntriesStore((s) => s.sort)
  const selectEntry = useEntriesStore((s) => s.selectEntry)
  const setFilter = useEntriesStore((s) => s.setFilter)
  const selectedGroupId = useGroupsStore((s) => s.selectedGroupId)

  const filteredEntries = useMemo(() => {
    let result = [...entries]

    // Filter by selected group
    if (selectedGroupId && !selectedGroupId.startsWith('__')) {
      result = result.filter((e) => e.groupId === selectedGroupId)
    }

    if (filter.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.username.toLowerCase().includes(q) ||
          e.url.toLowerCase().includes(q)
      )
    }

    if (filter.tags.length > 0) {
      result = result.filter((e) =>
        filter.tags.some((tag) => e.tags.includes(tag))
      )
    }

    if (filter.group) {
      result = result.filter((e) => e.groupId === filter.group)
    }

    result.sort((a, b) => {
      const aVal = a[sort.field] ?? ''
      const bVal = b[sort.field] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sort.direction === 'asc' ? cmp : -cmp
    })

    return result
  }, [entries, filter, sort, selectedGroupId])

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-2 border-b border-[rgb(var(--color-border))]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[rgb(var(--color-foreground-muted))]" />
          <Input
            placeholder="Einträge suchen..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[rgb(var(--color-foreground-muted))]">
            {filteredEntries.length} Einträge
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNewEntry}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[rgb(var(--color-foreground-muted))]">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Keine Einträge gefunden</p>
            {onNewEntry && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={onNewEntry}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Neuer Eintrag
              </Button>
            )}
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              selected={entry.id === selectedId}
              onSelect={() => selectEntry(entry.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
