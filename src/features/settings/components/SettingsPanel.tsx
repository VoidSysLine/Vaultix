import { useState } from 'react'
import {
  X, Sun, Moon, Monitor, Eye,
  Globe, Shield, ChevronRight
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'
import { useSettingsStore } from '@/features/settings/store/settingsStore'
import type { Theme } from '@/shared/types/common.types'

type SettingsTab = 'general' | 'security' | 'appearance'

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Hell', icon: Sun },
  { value: 'dark', label: 'Dunkel', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

const autoLockOptions = [
  { value: 0, label: 'Deaktiviert' },
  { value: 60, label: '1 Minute' },
  { value: 300, label: '5 Minuten' },
  { value: 600, label: '10 Minuten' },
  { value: 1800, label: '30 Minuten' },
  { value: 3600, label: '1 Stunde' },
]

const clipboardOptions = [
  { value: 0, label: 'Nie löschen' },
  { value: 10, label: '10 Sekunden' },
  { value: 30, label: '30 Sekunden' },
  { value: 60, label: '1 Minute' },
  { value: 120, label: '2 Minuten' },
]

interface SettingsPanelProps {
  onClose: () => void
}

function SettingRow({ label, description, children }: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-[rgb(var(--color-foreground-muted))] mt-0.5">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        checked ? 'bg-[var(--color-primary-600)]' : 'bg-[rgb(var(--color-border))]'
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

function SelectDropdown({ value, options, onChange }: {
  value: number
  options: { value: number; label: string }[]
  onChange: (v: number) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 px-2 pr-8 text-sm rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>('general')

  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const autoLockTimeout = useSettingsStore((s) => s.autoLockTimeout)
  const setAutoLockTimeout = useSettingsStore((s) => s.setAutoLockTimeout)
  const clearClipboardAfter = useSettingsStore((s) => s.clearClipboardAfter)
  const setClearClipboardAfter = useSettingsStore((s) => s.setClearClipboardAfter)
  const showPreviewPanel = useSettingsStore((s) => s.showPreviewPanel)
  const togglePreviewPanel = useSettingsStore((s) => s.togglePreviewPanel)
  const showSidebar = useSettingsStore((s) => s.showSidebar)
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar)
  const compactMode = useSettingsStore((s) => s.compactMode)
  const toggleCompactMode = useSettingsStore((s) => s.toggleCompactMode)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const tabs: { id: SettingsTab; label: string; icon: typeof Shield }[] = [
    { id: 'general', label: 'Allgemein', icon: Globe },
    { id: 'security', label: 'Sicherheit', icon: Shield },
    { id: 'appearance', label: 'Darstellung', icon: Eye },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-semibold">Einstellungen</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-[rgb(var(--color-border))] p-2 space-y-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors',
                  tab === t.id
                    ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-950)] dark:text-[var(--color-primary-300)]'
                    : 'hover:bg-[rgb(var(--color-accent))]'
                )}
                onClick={() => setTab(t.id)}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                <ChevronRight className="h-3 w-3 ml-auto" />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'general' && (
              <div className="space-y-1 divide-y divide-[rgb(var(--color-border))]">
                <SettingRow label="Sprache" description="App-Sprache ändern">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-8 px-2 pr-8 text-sm rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))] cursor-pointer"
                  >
                    <option value="de">Deutsch</option>
                    <option value="en">English</option>
                  </select>
                </SettingRow>

                <SettingRow label="Kompakte Ansicht" description="Weniger Abstand zwischen Elementen">
                  <Toggle checked={compactMode} onChange={toggleCompactMode} />
                </SettingRow>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-1 divide-y divide-[rgb(var(--color-border))]">
                <SettingRow label="Automatisch sperren" description="Datenbank nach Inaktivität sperren">
                  <SelectDropdown
                    value={autoLockTimeout}
                    options={autoLockOptions}
                    onChange={setAutoLockTimeout}
                  />
                </SettingRow>

                <SettingRow label="Zwischenablage löschen" description="Kopierte Passwörter automatisch löschen">
                  <SelectDropdown
                    value={clearClipboardAfter}
                    options={clipboardOptions}
                    onChange={setClearClipboardAfter}
                  />
                </SettingRow>
              </div>
            )}

            {tab === 'appearance' && (
              <div className="space-y-4">
                {/* Theme Selection */}
                <div>
                  <div className="text-sm font-medium mb-3">Farbschema</div>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                          theme === opt.value
                            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]'
                            : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-foreground-muted))]'
                        )}
                        onClick={() => setTheme(opt.value)}
                      >
                        <opt.icon className="h-5 w-5" />
                        <span className="text-sm">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 divide-y divide-[rgb(var(--color-border))]">
                  <SettingRow label="Seitenleiste anzeigen" description="Gruppenbaum ein-/ausblenden">
                    <Toggle checked={showSidebar} onChange={toggleSidebar} />
                  </SettingRow>

                  <SettingRow label="Vorschau anzeigen" description="Eintragsvorschau ein-/ausblenden">
                    <Toggle checked={showPreviewPanel} onChange={togglePreviewPanel} />
                  </SettingRow>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
