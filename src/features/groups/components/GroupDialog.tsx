import { useState } from 'react'
import { X, FolderPlus, Pencil } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { groupsApi } from '@/shared/utils/api'

interface GroupDialogProps {
  mode: 'create' | 'rename'
  parentId?: string | null
  groupId?: string
  initialName?: string
  onClose: () => void
  onSuccess: () => void
}

export function GroupDialog({ mode, parentId, groupId, initialName = '', onClose, onSuccess }: GroupDialogProps) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Bitte einen Namen eingeben')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (mode === 'create') {
        await groupsApi.create({
          name: name.trim(),
          parent_id: parentId || undefined,
        })
      } else if (groupId) {
        await groupsApi.update(groupId, { name: name.trim() })
      }
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {mode === 'create' ? (
              <FolderPlus className="h-5 w-5 text-[var(--color-primary-500)]" />
            ) : (
              <Pencil className="h-5 w-5 text-[var(--color-primary-500)]" />
            )}
            <h2 className="text-lg font-semibold">
              {mode === 'create' ? 'Neue Gruppe' : 'Gruppe umbenennen'}
            </h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Gruppenname</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Arbeit, Privat, Bank..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
                if (e.key === 'Escape') onClose()
              }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={handleSubmit} loading={loading} disabled={loading || !name.trim()}>
              {mode === 'create' ? 'Erstellen' : 'Umbenennen'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
