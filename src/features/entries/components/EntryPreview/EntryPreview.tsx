import {
  Globe, User, Key, Link, FileText, Tag, Clock,
  Edit, Trash2, Copy, Paperclip
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { ProtectedField } from '@/shared/components/ProtectedField'
import { CopyableField } from '@/shared/components/CopyableField'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import type { KdbxEntry } from '@/shared/types/kdbx.types'

function FieldSection({ label, icon: Icon, children }: {
  label: string
  icon: typeof Globe
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="pl-5">{children}</div>
    </div>
  )
}

function EntryDetail({ entry }: { entry: KdbxEntry }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] text-[var(--color-primary-600)] dark:text-[var(--color-primary-300)]">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{entry.title}</h2>
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-primary-500)] hover:underline"
              >
                {entry.url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-error)]">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Standard Fields */}
      <div className="space-y-4">
        <FieldSection label="Benutzername" icon={User}>
          <CopyableField value={entry.username} mono />
        </FieldSection>

        <FieldSection label="Passwort" icon={Key}>
          <ProtectedField value={entry.password} mono />
        </FieldSection>

        {entry.url && (
          <FieldSection label="URL" icon={Link}>
            <CopyableField value={entry.url} />
          </FieldSection>
        )}
      </div>

      {/* Custom Fields */}
      {entry.customFields.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] flex items-center gap-1.5">
            <Copy className="h-3 w-3" />
            Benutzerdefinierte Felder
          </h3>
          <div className="space-y-2 pl-5">
            {entry.customFields.map((field) =>
              field.protected ? (
                <ProtectedField
                  key={field.name}
                  label={field.name}
                  value={field.value}
                  mono
                />
              ) : (
                <CopyableField
                  key={field.name}
                  label={field.name}
                  value={field.value}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* Attachments */}
      {entry.attachments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] flex items-center gap-1.5">
            <Paperclip className="h-3 w-3" />
            Anhänge
          </h3>
          <div className="space-y-1 pl-5">
            {entry.attachments.map((att) => (
              <button
                key={att.id}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--color-accent))] transition-colors"
              >
                <FileText className="h-4 w-4 text-[rgb(var(--color-foreground-muted))]" />
                <span className="flex-1 text-left truncate">{att.filename}</span>
                <span className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  {formatSize(att.size)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Notizen
          </h3>
          <div className="pl-5">
            <p className="text-sm whitespace-pre-wrap text-[rgb(var(--color-foreground-secondary))]">
              {entry.notes}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5 pl-5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-300)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-[rgb(var(--color-border))]">
        <div className="grid grid-cols-2 gap-2 text-xs text-[rgb(var(--color-foreground-muted))]">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Erstellt: {new Date(entry.created).toLocaleDateString('de-DE')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Geändert: {new Date(entry.modified).toLocaleDateString('de-DE')}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function EntryPreview() {
  const entries = useEntriesStore((s) => s.entries)
  const selectedId = useEntriesStore((s) => s.selectedId)
  const selectedEntry = entries.find((e) => e.id === selectedId)

  if (!selectedEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[rgb(var(--color-foreground-muted))]">
        <Key className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">Kein Eintrag ausgewählt</p>
        <p className="text-xs mt-1">Wähle einen Eintrag aus der Liste</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <EntryDetail entry={selectedEntry} />
    </div>
  )
}
