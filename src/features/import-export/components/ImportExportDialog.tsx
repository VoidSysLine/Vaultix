import { useState } from 'react'
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'
import { entriesApi, groupsApi } from '@/shared/utils/api'
import { useEntriesStore } from '@/features/entries/store/entriesStore'

interface ImportExportDialogProps {
  onClose: () => void
  onDataChanged: () => void
}

type Tab = 'import' | 'export'
type ExportFormat = 'csv' | 'json'

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.toLowerCase()] = values[idx] || ''
    })
    rows.push(row)
  }

  return rows
}

function parseBitwardenJSON(text: string): Record<string, string>[] {
  try {
    const data = JSON.parse(text)
    const items = data.items || data.entries || data
    if (!Array.isArray(items)) return []

    return items.map((item: Record<string, unknown>) => {
      const login = (item.login || {}) as Record<string, unknown>
      const uris = login.uris as Array<Record<string, string>> | undefined
      return {
        title: String(item.name || ''),
        username: String(login.username || ''),
        password: String(login.password || ''),
        url: String(uris?.[0]?.uri || item.url || ''),
        notes: String(item.notes || ''),
        folder: String(item.folder || item.group || ''),
      }
    })
  } catch {
    return []
  }
}

export function ImportExportDialog({ onClose, onDataChanged }: ImportExportDialogProps) {
  const [tab, setTab] = useState<Tab>('import')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const entries = useEntriesStore((s) => s.entries)

  const handleImport = async (file: File) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const text = await file.text()
      let records: Record<string, string>[]

      if (file.name.endsWith('.json')) {
        records = parseBitwardenJSON(text)
      } else {
        records = parseCSV(text)
      }

      if (records.length === 0) {
        setError('Keine Einträge in der Datei gefunden')
        return
      }

      // Get existing groups to find a default group
      const groups = await groupsApi.list() as { id: string; name: string }[]
      const defaultGroupId = groups.length > 0 ? groups[0].id : ''

      let imported = 0
      for (const record of records) {
        try {
          await entriesApi.create({
            title: record.title || record.name || record.login_name || 'Importiert',
            username: record.username || record.login_username || '',
            password: record.password || record.login_password || '',
            url: record.url || record.login_uri || '',
            notes: record.notes || '',
            group_id: defaultGroupId,
          })
          imported++
        } catch {
          // Skip failed entries
        }
      }

      onDataChanged()
      setSuccess(`${imported} von ${records.length} Einträgen erfolgreich importiert`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Import fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: ExportFormat) => {
    setLoading(true)
    setError(null)

    try {
      let content: string
      let mimeType: string
      let filename: string

      if (format === 'csv') {
        const headers = ['title', 'username', 'password', 'url', 'notes', 'tags']
        const rows = entries.map((e) => [
          `"${e.title.replace(/"/g, '""')}"`,
          `"${e.username.replace(/"/g, '""')}"`,
          `"${e.password.replace(/"/g, '""')}"`,
          `"${e.url.replace(/"/g, '""')}"`,
          `"${(e.notes || '').replace(/"/g, '""')}"`,
          `"${e.tags.join(', ')}"`,
        ])
        content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        mimeType = 'text/csv'
        filename = 'vaultix-export.csv'
      } else {
        const data = entries.map((e) => ({
          title: e.title,
          username: e.username,
          password: e.password,
          url: e.url,
          notes: e.notes,
          tags: e.tags,
          customFields: e.customFields,
        }))
        content = JSON.stringify({ entries: data, exportDate: new Date().toISOString() }, null, 2)
        mimeType = 'application/json'
        filename = 'vaultix-export.json'
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      setSuccess(`${entries.length} Einträge exportiert als ${format.toUpperCase()}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Export fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.json'
    input.onchange = () => {
      if (input.files?.[0]) {
        handleImport(input.files[0])
      }
    }
    input.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-semibold">Import / Export</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgb(var(--color-border))]">
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2',
              tab === 'import'
                ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                : 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
            )}
            onClick={() => { setTab('import'); setError(null); setSuccess(null) }}
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2',
              tab === 'export'
                ? 'border-[var(--color-primary-500)] text-[var(--color-primary-600)]'
                : 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
            )}
            onClick={() => { setTab('export'); setError(null); setSuccess(null) }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'import' ? (
            <div className="space-y-4">
              <p className="text-sm text-[rgb(var(--color-foreground-muted))]">
                Importiere Passwörter aus CSV oder JSON-Dateien (Bitwarden, LastPass, etc.).
              </p>

              <Button
                className="w-full"
                onClick={handleFileSelect}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Importiere...</>
                ) : (
                  <><FileSpreadsheet className="h-4 w-4 mr-2" />Datei auswählen</>
                )}
              </Button>

              <div className="text-xs text-[rgb(var(--color-foreground-muted))] space-y-1">
                <p>Unterstützte Formate:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>CSV (mit Spalten: title, username, password, url, notes)</li>
                  <li>Bitwarden JSON-Export</li>
                  <li>LastPass CSV-Export</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[rgb(var(--color-foreground-muted))]">
                Exportiere {entries.length} Einträge in ein gewähltes Format.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => handleExport('csv')}
                  disabled={loading}
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  <span className="text-sm font-medium">CSV</span>
                  <span className="text-xs text-[rgb(var(--color-foreground-muted))]">Tabellenformat</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => handleExport('json')}
                  disabled={loading}
                >
                  <Download className="h-6 w-6" />
                  <span className="text-sm font-medium">JSON</span>
                  <span className="text-xs text-[rgb(var(--color-foreground-muted))]">Strukturiert</span>
                </Button>
              </div>

              <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Exportierte Dateien enthalten Klartext-Passwörter. Sicher aufbewahren!
              </p>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
              <p className="text-sm text-green-500">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
