import { Globe, User } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { KdbxEntry } from '@/shared/types/kdbx.types'

interface EntryItemProps {
  entry: KdbxEntry
  selected: boolean
  onSelect: () => void
}

export function EntryItem({ entry, selected, onSelect }: EntryItemProps) {
  return (
    <button
      className={cn(
        'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors border-b border-[rgb(var(--color-border))]',
        'hover:bg-[rgb(var(--color-accent))]',
        selected && 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)] border-l-2 border-l-[var(--color-primary-500)]'
      )}
      onClick={onSelect}
    >
      {/* Icon */}
      <div className={cn(
        'flex items-center justify-center h-9 w-9 rounded-lg shrink-0 mt-0.5',
        'bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]',
        'text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)]'
      )}>
        <Globe className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{entry.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <User className="h-3 w-3 text-[rgb(var(--color-foreground-muted))]" />
          <p className="text-xs text-[rgb(var(--color-foreground-muted))] truncate">
            {entry.username || 'Kein Benutzername'}
          </p>
        </div>
        {entry.url && (
          <p className="text-xs text-[rgb(var(--color-foreground-muted))] truncate mt-0.5">
            {entry.url.replace(/^https?:\/\//, '')}
          </p>
        )}
      </div>
    </button>
  )
}
