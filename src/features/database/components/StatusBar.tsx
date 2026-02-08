import { Circle, Database, Clock, Save, Lock } from 'lucide-react'
import { useDatabaseStore } from '@/features/database/store/databaseStore'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import { Button } from '@/shared/ui/button'
import { useHotkeys } from '@/shared/hooks/useHotkeys'
import { databaseApi } from '@/shared/utils/api'
import { toast } from '@/shared/components/Toast'

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'gerade eben'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`
  return date.toLocaleDateString('de-DE')
}

interface StatusBarProps {
  onLock?: () => void
}

export function StatusBar({ onLock }: StatusBarProps) {
  const isDirty = useDatabaseStore((s) => s.isDirty)
  const lastSaved = useDatabaseStore((s) => s.lastSaved)
  const database = useDatabaseStore((s) => s.database)
  const entries = useEntriesStore((s) => s.entries)

  const handleSave = async () => {
    try {
      await databaseApi.save()
      useDatabaseStore.getState().setLastSaved(new Date())
      toast('success', 'Datenbank gespeichert')
    } catch (err: unknown) {
      toast('error', err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
    }
  }

  useHotkeys('ctrl+s', handleSave)

  return (
    <div className="h-8 bg-[rgb(var(--color-background-secondary))] border-t border-[rgb(var(--color-border))] flex items-center justify-between px-4 text-xs text-[rgb(var(--color-foreground-muted))] select-none">
      <div className="flex items-center gap-4">
        {database && (
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            <span>{database.name}</span>
          </div>
        )}
        {lastSaved && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Gespeichert: {formatRelativeTime(lastSaved)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>Einträge: {entries.length}</span>
        <div className="flex items-center gap-1.5">
          {isDirty ? (
            <>
              <Circle className="h-2.5 w-2.5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
              <span className="text-[var(--color-warning)]">Geändert</span>
              <Button variant="ghost" size="sm" className="h-5 px-1.5 text-xs ml-1" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                Speichern
              </Button>
            </>
          ) : (
            <>
              <Circle className="h-2.5 w-2.5 fill-[var(--color-success)] text-[var(--color-success)]" />
              <span>Gespeichert</span>
            </>
          )}
        </div>
        {onLock && (
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-xs" onClick={onLock}>
            <Lock className="h-3 w-3 mr-1" />
            Sperren
          </Button>
        )}
      </div>
    </div>
  )
}
