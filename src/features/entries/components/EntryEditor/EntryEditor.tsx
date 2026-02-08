import { useState } from 'react'
import { Save, X, Plus, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'
import { generatePassword, DEFAULT_PASSWORD_OPTIONS } from '@/features/generator/services/passwordService'
import type { KdbxEntry, CustomField } from '@/shared/types/kdbx.types'

interface EntryEditorProps {
  entry?: KdbxEntry | null // null = new entry
  groupId: string
  onSave: (data: EntryFormData) => Promise<void>
  onCancel: () => void
}

export interface EntryFormData {
  title: string
  username: string
  password: string
  url: string
  notes: string
  tags: string[]
  customFields: CustomField[]
}

export function EntryEditor({ entry, groupId, onSave, onCancel }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title ?? '')
  const [username, setUsername] = useState(entry?.username ?? '')
  const [password, setPassword] = useState(entry?.password ?? '')
  const [url, setUrl] = useState(entry?.url ?? '')
  const [notes, setNotes] = useState(entry?.notes ?? '')
  const [tagsStr, setTagsStr] = useState(entry?.tags.join(', ') ?? '')
  const [customFields, setCustomFields] = useState<CustomField[]>(
    entry?.customFields ?? []
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Titel ist erforderlich')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        title: title.trim(),
        username,
        password,
        url,
        notes,
        tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
        customFields,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const generateNewPassword = () => {
    setPassword(generatePassword(DEFAULT_PASSWORD_OPTIONS))
  }

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '', protected: false }])
  }

  const updateCustomField = (index: number, updates: Partial<CustomField>) => {
    setCustomFields(
      customFields.map((f, i) => (i === index ? { ...f, ...updates } : f))
    )
  }

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  // Suppress unused variable warning - groupId is used by the parent
  void groupId

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-semibold">
            {entry ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Titel *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. GitHub, Gmail, Sparkasse..."
              autoFocus
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Benutzername</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Benutzername oder E-Mail"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Passwort</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={generateNewPassword}
                title="Passwort generieren"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags</label>
            <Input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="banking, wichtig, 2fa (kommagetrennt)"
            />
          </div>

          {/* Custom Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Benutzerdefinierte Felder</label>
              <Button variant="ghost" size="sm" onClick={addCustomField}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Feld
              </Button>
            </div>
            {customFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={field.name}
                  onChange={(e) => updateCustomField(index, { name: e.target.value })}
                  placeholder="Feldname"
                  className="w-1/3"
                />
                <Input
                  value={field.value}
                  onChange={(e) => updateCustomField(index, { value: e.target.value })}
                  placeholder="Wert"
                  className={cn('flex-1', field.protected && 'font-mono')}
                />
                <label className="flex items-center gap-1 text-xs text-[rgb(var(--color-foreground-muted))] shrink-0">
                  <input
                    type="checkbox"
                    checked={field.protected}
                    onChange={(e) => updateCustomField(index, { protected: e.target.checked })}
                    className="accent-[var(--color-primary-500)]"
                  />
                  Geheim
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-[var(--color-error)]"
                  onClick={() => removeCustomField(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Zusätzliche Informationen..."
              rows={4}
              className={cn(
                'flex w-full rounded-md border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm',
                'placeholder:text-[rgb(var(--color-foreground-muted))]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]',
                'resize-y'
              )}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[rgb(var(--color-border))]">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}
