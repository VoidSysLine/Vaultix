import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import { useHotkeys } from '@/shared/hooks/useHotkeys'
import { useRef } from 'react'

export function SearchBar() {
  const setFilter = useEntriesStore((s) => s.setFilter)
  const filter = useEntriesStore((s) => s.filter)
  const inputRef = useRef<HTMLInputElement>(null)

  useHotkeys('ctrl+f', () => {
    inputRef.current?.focus()
  })

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-foreground-muted))]" />
      <Input
        ref={inputRef}
        placeholder="Suchen... (Ctrl+F)"
        value={filter.search}
        onChange={(e) => setFilter({ search: e.target.value })}
        className="pl-10 h-9 bg-[rgb(var(--color-background-secondary))]"
      />
    </div>
  )
}
