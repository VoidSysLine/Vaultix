import { useEffect, useState, useCallback } from 'react'
import { MenuBar } from '@/features/database/components/MenuBar'
import { Header } from '@/features/database/components/Header'
import { StatusBar } from '@/features/database/components/StatusBar'
import { GroupTree } from '@/features/groups/components/GroupTree'
import { EntryList } from '@/features/entries/components/EntryList/EntryList'
import { EntryPreview } from '@/features/entries/components/EntryPreview/EntryPreview'
import { PasswordGenerator } from '@/features/generator/components/PasswordGenerator'
import { LoginScreen } from '@/features/auth/components/LoginScreen'
import { EntryEditor, type EntryFormData } from '@/features/entries/components/EntryEditor/EntryEditor'
import { SettingsPanel } from '@/features/settings/components/SettingsPanel'
import { SecurityAudit } from '@/features/audit/components/SecurityAudit'
import { ImportExportDialog } from '@/features/import-export/components/ImportExportDialog'
import { GroupDialog } from '@/features/groups/components/GroupDialog'
import { ConfirmDialog } from '@/features/database/components/ConfirmDialog'
import { AboutDialog } from '@/features/database/components/AboutDialog'
import { ToastContainer, toast } from '@/shared/components/Toast'
import { useSettingsStore } from '@/features/settings/store/settingsStore'
import { useGroupsStore } from '@/features/groups/store/groupsStore'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import { useDatabaseStore } from '@/features/database/store/databaseStore'
import { useAutoLock } from '@/shared/hooks/useAutoLock'
import { useAutoSave } from '@/shared/hooks/useAutoSave'
import { initApi, entriesApi, groupsApi, databaseApi, waitForBackend } from '@/shared/utils/api'
import { cn } from '@/shared/utils/cn'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { KdbxEntry, KdbxGroup } from '@/shared/types/kdbx.types'

// ============================================
// Data loading from backend
// ============================================

interface RawEntry {
  id: string
  title: string
  username: string
  password: string
  url: string
  notes: string
  icon: number
  tags: string[]
  group_id: string
  custom_fields: Record<string, { value: string; protected: boolean }>
  attachments: { id: string; filename: string; size: number }[]
  created: string
  modified: string
  expiry_time: string | null
}

interface RawGroup {
  id: string
  name: string
  icon: number
  parent_id: string | null
  children: RawGroup[]
  entry_count: number
}

async function loadFromBackend() {
  const [rawEntries, rawGroups] = await Promise.all([
    entriesApi.list() as Promise<RawEntry[]>,
    groupsApi.list() as Promise<RawGroup[]>,
  ])

  const entries: KdbxEntry[] = rawEntries.map((e) => ({
    id: e.id,
    title: e.title,
    username: e.username,
    password: e.password,
    url: e.url,
    notes: e.notes,
    icon: e.icon || 0,
    tags: e.tags || [],
    groupId: e.group_id,
    customFields: Object.entries(e.custom_fields || {}).map(([name, field]) => ({
      name,
      value: field.value,
      protected: field.protected,
    })),
    attachments: (e.attachments || []).map((a) => ({
      id: a.id,
      filename: a.filename,
      size: a.size,
      mimeType: '',
    })),
    created: e.created,
    modified: e.modified,
    accessed: '',
    expiryTime: e.expiry_time || null,
    isExpired: false,
  }))

  const mapGroup = (g: RawGroup): KdbxGroup => ({
    id: g.id,
    name: g.name,
    icon: g.icon || 0,
    parentId: g.parent_id || null,
    children: (g.children || []).map(mapGroup),
    entryCount: g.entry_count || 0,
  })
  const groups: KdbxGroup[] = rawGroups.map(mapGroup)

  useEntriesStore.getState().setEntries(entries)
  useGroupsStore.getState().setGroups(groups)
}

// ============================================
// Dialogs
// ============================================

function GeneratorDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Generator</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <PasswordGenerator />
      </div>
    </div>
  )
}

// ============================================
// Group Dialog State
// ============================================

interface GroupDialogState {
  mode: 'create' | 'rename'
  parentId?: string
  groupId?: string
  initialName?: string
}

// ============================================
// Main App
// ============================================

type AppView = 'loading' | 'login' | 'main'

function App() {
  const showSidebar = useSettingsStore((s) => s.showSidebar)
  const showPreviewPanel = useSettingsStore((s) => s.showPreviewPanel)
  const database = useDatabaseStore((s) => s.database)
  const selectedId = useEntriesStore((s) => s.selectedId)
  const entries = useEntriesStore((s) => s.entries)

  const [view, setView] = useState<AppView>('loading')
  const [showGenerator, setShowGenerator] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAudit, setShowAudit] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [editingEntry, setEditingEntry] = useState<KdbxEntry | null | undefined>(undefined)
  const [backendReady, setBackendReady] = useState(false)
  const [groupDialog, setGroupDialog] = useState<GroupDialogState | null>(null)
  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState<KdbxGroup | null>(null)
  const [showAbout, setShowAbout] = useState(false)

  // Auto-save
  useAutoSave()

  // Initialize API and wait for backend
  useEffect(() => {
    async function init() {
      await initApi()
      const ready = await waitForBackend(60, 500)
      setBackendReady(ready)
      if (ready) {
        try {
          const res = await fetch('http://127.0.0.1:18923/api/database/status')
          const status = await res.json()
          if (status.is_open) {
            const info = await databaseApi.info()
            handleDatabaseOpened(info)
            return
          }
        } catch {
          // Backend might not be running
        }
      }
      setView('login')
    }
    init()
  }, [])

  const handleDatabaseOpened = useCallback(
    async (info: { name: string; path: string; entry_count: number; group_count: number }) => {
      useDatabaseStore.getState().setDatabase({
        name: info.name,
        description: '',
        path: info.path,
        rootGroup: { id: 'root', name: 'Root', icon: 0, parentId: null, children: [], entryCount: 0 },
        recycleBinId: null,
        version: '4.0',
        cipher: 'ChaCha20',
        kdf: 'Argon2id',
      })
      useDatabaseStore.getState().setLastSaved(new Date())
      await loadFromBackend()
      setView('main')
    },
    []
  )

  const handleLockDatabase = useCallback(async () => {
    try { await databaseApi.close() } catch { /* ignore */ }
    useDatabaseStore.getState().setDatabase(null)
    useEntriesStore.getState().setEntries([])
    useGroupsStore.getState().setGroups([])
    useEntriesStore.getState().selectEntry(null)
    setView('login')
  }, [])

  // Auto-lock
  useAutoLock(useCallback(() => {
    if (view === 'main') {
      handleLockDatabase()
    }
  }, [view, handleLockDatabase]))

  const handleSaveEntry = useCallback(
    async (data: EntryFormData) => {
      try {
        const selectedGroupId = useGroupsStore.getState().selectedGroupId
        const groupId = selectedGroupId && !selectedGroupId.startsWith('__') ? selectedGroupId : ''

        if (editingEntry === null) {
          await entriesApi.create({
            title: data.title,
            username: data.username,
            password: data.password,
            url: data.url,
            notes: data.notes,
            group_id: groupId,
            tags: data.tags,
            custom_fields: Object.fromEntries(data.customFields.map((f) => [f.name, f.value])),
          })
          toast('success', `"${data.title}" erstellt`)
        } else if (editingEntry) {
          await entriesApi.update(editingEntry.id, {
            title: data.title,
            username: data.username,
            password: data.password,
            url: data.url,
            notes: data.notes,
            tags: data.tags,
            custom_fields: Object.fromEntries(data.customFields.map((f) => [f.name, f.value])),
          })
          toast('success', `"${data.title}" gespeichert`)
        }

        await loadFromBackend()
        useDatabaseStore.getState().setLastSaved(new Date())
        setEditingEntry(undefined)
      } catch (err: unknown) {
        toast('error', err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    },
    [editingEntry]
  )

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    try {
      await entriesApi.delete(entryId)
      await loadFromBackend()
      useEntriesStore.getState().selectEntry(null)
      useDatabaseStore.getState().setLastSaved(new Date())
      toast('success', 'Eintrag gelöscht')
    } catch (err: unknown) {
      toast('error', err instanceof Error ? err.message : 'Fehler beim Löschen')
    }
  }, [])

  // Group management
  const handleCreateGroup = useCallback((parentId?: string) => {
    setGroupDialog({ mode: 'create', parentId })
  }, [])

  const handleRenameGroup = useCallback((group: KdbxGroup) => {
    setGroupDialog({ mode: 'rename', groupId: group.id, initialName: group.name })
  }, [])

  const handleDeleteGroup = useCallback((group: KdbxGroup) => {
    setDeleteGroupConfirm(group)
  }, [])

  const confirmDeleteGroup = useCallback(async () => {
    if (!deleteGroupConfirm) return
    try {
      await groupsApi.delete(deleteGroupConfirm.id)
      await loadFromBackend()
      useGroupsStore.getState().selectGroup(null)
      toast('success', `Gruppe "${deleteGroupConfirm.name}" gelöscht`)
    } catch (err: unknown) {
      toast('error', err instanceof Error ? err.message : 'Fehler beim Löschen')
    }
    setDeleteGroupConfirm(null)
  }, [deleteGroupConfirm])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        setShowGenerator((prev) => !prev)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey && view === 'main') {
        e.preventDefault()
        setEditingEntry(null)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && view === 'main' && selectedId) {
        e.preventDefault()
        const entry = entries.find((en) => en.id === selectedId)
        if (entry) setEditingEntry(entry)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l' && view === 'main') {
        e.preventDefault()
        handleLockDatabase()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === ',' && view === 'main') {
        e.preventDefault()
        setShowSettings((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [view, selectedId, entries, handleLockDatabase])

  // Expose dirty state for Electron
  useEffect(() => {
    window.__vaultixIsDirty = () => useDatabaseStore.getState().isDirty
    window.__vaultixSave = async () => {
      await databaseApi.save()
      useDatabaseStore.getState().markClean()
    }
  }, [])

  // ==========================================
  // Render
  // ==========================================

  if (view === 'loading') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary-950)] via-[#0f172a] to-[#020617]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-400)] mb-4" />
        <p className="text-sm text-slate-400">
          {backendReady ? 'Datenbank wird geladen...' : 'Backend wird gestartet...'}
        </p>
      </div>
    )
  }

  if (view === 'login' || !database) {
    return <LoginScreen onDatabaseOpened={handleDatabaseOpened} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <MenuBar />
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onLock={handleLockDatabase}
        onOpenAudit={() => setShowAudit(true)}
        onOpenImportExport={() => setShowImportExport(true)}
        onOpenGenerator={() => setShowGenerator(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <aside className={cn(
            'w-[200px] shrink-0 border-r border-[rgb(var(--color-border))]',
            'bg-[rgb(var(--color-background-secondary))]'
          )}>
            <GroupTree
              onCreateGroup={handleCreateGroup}
              onRenameGroup={handleRenameGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          </aside>
        )}

        <div className={cn(
          'w-[400px] shrink-0 border-r border-[rgb(var(--color-border))]',
          'bg-[rgb(var(--color-background))]'
        )}>
          <EntryList
            onNewEntry={() => setEditingEntry(null)}
            onEditEntry={(entry) => setEditingEntry(entry)}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>

        {showPreviewPanel && (
          <main className="flex-1 min-w-0 bg-[rgb(var(--color-background))]">
            <EntryPreview
              onEdit={(entry) => setEditingEntry(entry)}
              onDelete={handleDeleteEntry}
            />
          </main>
        )}
      </div>

      <StatusBar onLock={handleLockDatabase} />

      {/* Dialogs */}
      {showGenerator && <GeneratorDialog onClose={() => setShowGenerator(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showAudit && (
        <SecurityAudit
          onClose={() => setShowAudit(false)}
          onSelectEntry={(entry) => {
            useEntriesStore.getState().selectEntry(entry.id)
            setShowAudit(false)
          }}
        />
      )}
      {showImportExport && (
        <ImportExportDialog
          onClose={() => setShowImportExport(false)}
          onDataChanged={loadFromBackend}
        />
      )}

      {editingEntry !== undefined && (
        <EntryEditor
          entry={editingEntry}
          groupId={useGroupsStore.getState().selectedGroupId || ''}
          onSave={handleSaveEntry}
          onCancel={() => setEditingEntry(undefined)}
        />
      )}

      {groupDialog && (
        <GroupDialog
          mode={groupDialog.mode}
          parentId={groupDialog.parentId}
          groupId={groupDialog.groupId}
          initialName={groupDialog.initialName}
          onClose={() => setGroupDialog(null)}
          onSuccess={async () => {
            setGroupDialog(null)
            await loadFromBackend()
          }}
        />
      )}

      {deleteGroupConfirm && (
        <ConfirmDialog
          title="Gruppe löschen"
          message={`Möchtest du die Gruppe "${deleteGroupConfirm.name}" wirklich löschen? Alle Einträge werden in den Papierkorb verschoben.`}
          confirmLabel="Löschen"
          destructive
          onConfirm={confirmDeleteGroup}
          onCancel={() => setDeleteGroupConfirm(null)}
        />
      )}

      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}

      <ToastContainer />
    </div>
  )
}

export default App
