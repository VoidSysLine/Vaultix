import { useMemo } from 'react'
import {
  X, Shield, AlertTriangle, AlertCircle, CheckCircle, Key
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import type { KdbxEntry } from '@/shared/types/kdbx.types'

interface SecurityAuditProps {
  onClose: () => void
  onSelectEntry?: (entry: KdbxEntry) => void
}

interface AuditIssue {
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  entries: KdbxEntry[]
}

function estimatePasswordStrength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  return Math.min(score, 5)
}

function AuditCard({ issue, onSelectEntry }: { issue: AuditIssue; onSelectEntry?: (e: KdbxEntry) => void }) {
  const iconMap = {
    critical: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <CheckCircle className="h-5 w-5 text-blue-500" />,
  }

  const bgMap = {
    critical: 'border-red-500/20 bg-red-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  }

  return (
    <div className={cn('rounded-lg border p-4', bgMap[issue.type])}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{iconMap[issue.type]}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">{issue.title}</h3>
          <p className="text-xs text-[rgb(var(--color-foreground-muted))] mt-1">{issue.description}</p>
          {issue.entries.length > 0 && (
            <div className="mt-3 space-y-1">
              {issue.entries.slice(0, 5).map((entry) => (
                <button
                  key={entry.id}
                  className="flex items-center gap-2 w-full px-2 py-1 text-xs rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  onClick={() => onSelectEntry?.(entry)}
                >
                  <Key className="h-3 w-3 shrink-0" />
                  <span className="truncate">{entry.title}</span>
                  {entry.username && (
                    <span className="text-[rgb(var(--color-foreground-muted))] truncate">({entry.username})</span>
                  )}
                </button>
              ))}
              {issue.entries.length > 5 && (
                <p className="text-xs text-[rgb(var(--color-foreground-muted))] pl-2">
                  +{issue.entries.length - 5} weitere
                </p>
              )}
            </div>
          )}
        </div>
        <span className={cn(
          'shrink-0 text-xs font-bold px-2 py-0.5 rounded-full',
          issue.type === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
          issue.type === 'warning' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
          issue.type === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        )}>
          {issue.entries.length}
        </span>
      </div>
    </div>
  )
}

export function SecurityAudit({ onClose, onSelectEntry }: SecurityAuditProps) {
  const entries = useEntriesStore((s) => s.entries)

  const audit = useMemo(() => {
    const issues: AuditIssue[] = []

    // Weak passwords
    const weakPasswords = entries.filter((e) => estimatePasswordStrength(e.password) <= 2)
    if (weakPasswords.length > 0) {
      issues.push({
        type: 'critical',
        title: 'Schwache Passwörter',
        description: 'Diese Einträge haben schwache Passwörter, die leicht geknackt werden können.',
        entries: weakPasswords,
      })
    }

    // Duplicate passwords
    const passwordMap = new Map<string, KdbxEntry[]>()
    for (const entry of entries) {
      if (!entry.password) continue
      const existing = passwordMap.get(entry.password) || []
      existing.push(entry)
      passwordMap.set(entry.password, existing)
    }
    const duplicateEntries = Array.from(passwordMap.values())
      .filter((group) => group.length > 1)
      .flat()
    if (duplicateEntries.length > 0) {
      issues.push({
        type: 'critical',
        title: 'Doppelte Passwörter',
        description: 'Diese Einträge verwenden dasselbe Passwort. Verwende einzigartige Passwörter für jeden Dienst.',
        entries: duplicateEntries,
      })
    }

    // Empty passwords
    const emptyPasswords = entries.filter((e) => !e.password)
    if (emptyPasswords.length > 0) {
      issues.push({
        type: 'warning',
        title: 'Leere Passwörter',
        description: 'Diese Einträge haben kein Passwort gesetzt.',
        entries: emptyPasswords,
      })
    }

    // Old entries (not modified in > 180 days)
    const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000
    const oldEntries = entries.filter((e) => {
      const modified = new Date(e.modified).getTime()
      return modified > 0 && modified < sixMonthsAgo
    })
    if (oldEntries.length > 0) {
      issues.push({
        type: 'warning',
        title: 'Alte Passwörter',
        description: 'Diese Passwörter wurden seit über 6 Monaten nicht geändert.',
        entries: oldEntries,
      })
    }

    // Expired entries
    const expiredEntries = entries.filter((e) => {
      if (!e.expiryTime) return false
      return new Date(e.expiryTime).getTime() < Date.now()
    })
    if (expiredEntries.length > 0) {
      issues.push({
        type: 'warning',
        title: 'Abgelaufene Einträge',
        description: 'Diese Einträge sind abgelaufen und sollten aktualisiert werden.',
        entries: expiredEntries,
      })
    }

    // No URL
    const noUrl = entries.filter((e) => !e.url && e.password)
    if (noUrl.length > 0) {
      issues.push({
        type: 'info',
        title: 'Fehlende URLs',
        description: 'Diese Einträge haben keine URL. Das Hinzufügen von URLs verbessert die Auto-Fill-Funktion.',
        entries: noUrl,
      })
    }

    return issues
  }, [entries])

  const totalIssues = audit.reduce((sum, issue) => sum + issue.entries.length, 0)
  const criticalCount = audit.filter((i) => i.type === 'critical').reduce((s, i) => s + i.entries.length, 0)
  const warningCount = audit.filter((i) => i.type === 'warning').reduce((s, i) => s + i.entries.length, 0)

  const scorePercent = entries.length > 0
    ? Math.max(0, Math.round(100 - (criticalCount * 15 + warningCount * 5)))
    : 100

  const scoreColor = scorePercent >= 80 ? 'text-green-500' : scorePercent >= 50 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-lg font-semibold">Sicherheits-Audit</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Score */}
        <div className="px-6 py-5 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[rgb(var(--color-border))]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={scoreColor}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${scorePercent}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn('text-lg font-bold', scoreColor)}>{scorePercent}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Sicherheitsbewertung</h3>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] mt-1">
                {totalIssues === 0
                  ? 'Ausgezeichnet! Keine Probleme gefunden.'
                  : `${totalIssues} Problem${totalIssues !== 1 ? 'e' : ''} in ${entries.length} Einträgen gefunden.`}
              </p>
              <div className="flex gap-4 mt-2">
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" /> {criticalCount} kritisch
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-yellow-500">
                    <AlertTriangle className="h-3 w-3" /> {warningCount} Warnungen
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {audit.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <p className="font-medium">Alles sicher!</p>
              <p className="text-sm text-[rgb(var(--color-foreground-muted))] mt-1">
                Keine Sicherheitsprobleme gefunden.
              </p>
            </div>
          ) : (
            audit.map((issue, i) => (
              <AuditCard key={i} issue={issue} onSelectEntry={onSelectEntry} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
