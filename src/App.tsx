import { useEffect, useState } from 'react'
import { MenuBar } from '@/features/database/components/MenuBar'
import { Header } from '@/features/database/components/Header'
import { StatusBar } from '@/features/database/components/StatusBar'
import { GroupTree } from '@/features/groups/components/GroupTree'
import { EntryList } from '@/features/entries/components/EntryList/EntryList'
import { EntryPreview } from '@/features/entries/components/EntryPreview/EntryPreview'
import { PasswordGenerator } from '@/features/generator/components/PasswordGenerator'
import { useSettingsStore } from '@/features/settings/store/settingsStore'
import { useGroupsStore } from '@/features/groups/store/groupsStore'
import { useEntriesStore } from '@/features/entries/store/entriesStore'
import { useDatabaseStore } from '@/features/database/store/databaseStore'
import { cn } from '@/shared/utils/cn'
import { X } from 'lucide-react'
import { Button } from '@/shared/ui/button'

function loadDemoData() {
  const groups = useGroupsStore.getState()
  const entries = useEntriesStore.getState()
  const database = useDatabaseStore.getState()

  database.setDatabase({
    name: 'Meine Passwörter',
    description: 'Haupt-Datenbank',
    path: '/home/user/passwords.kdbx',
    rootGroup: {
      id: 'root',
      name: 'Root',
      icon: 0,
      parentId: null,
      children: [],
      entryCount: 0,
    },
    recycleBinId: null,
    version: '4.0',
    cipher: 'ChaCha20',
    kdf: 'Argon2id',
  })

  groups.setGroups([
    {
      id: 'g1',
      name: 'Banking',
      icon: 0,
      parentId: null,
      entryCount: 3,
      children: [
        { id: 'g1-1', name: 'Kreditkarten', icon: 0, parentId: 'g1', children: [], entryCount: 2 },
      ],
    },
    {
      id: 'g2',
      name: 'E-Mail',
      icon: 0,
      parentId: null,
      children: [],
      entryCount: 2,
    },
    {
      id: 'g3',
      name: 'Social Media',
      icon: 0,
      parentId: null,
      children: [],
      entryCount: 4,
    },
    {
      id: 'g4',
      name: 'Arbeit',
      icon: 0,
      parentId: null,
      entryCount: 5,
      children: [
        { id: 'g4-1', name: 'VPN & Server', icon: 0, parentId: 'g4', children: [], entryCount: 3 },
        { id: 'g4-2', name: 'Cloud Services', icon: 0, parentId: 'g4', children: [], entryCount: 2 },
      ],
    },
    {
      id: 'g5',
      name: 'Shopping',
      icon: 0,
      parentId: null,
      children: [],
      entryCount: 6,
    },
  ])

  entries.setEntries([
    {
      id: 'e1',
      title: 'Sparkasse Trier',
      username: 'max.mustermann',
      password: 'Sp4rkasse!2024#Trier',
      url: 'https://www.sparkasse-trier.de',
      notes: 'Hauptkonto für Gehalt und laufende Kosten.\nKontonummer: 1234567890',
      icon: 0,
      tags: ['banking', 'wichtig'],
      groupId: 'g1',
      customFields: [
        { name: 'IBAN', value: 'DE89 3704 0044 0532 0130 00', protected: false },
        { name: 'BIC', value: 'TRISDE55XXX', protected: false },
        { name: 'Kontonummer', value: '1234567890', protected: false },
        { name: 'PIN', value: '54321', protected: true },
      ],
      attachments: [
        { id: 'a1', filename: 'Kontovertrag.pdf', size: 245760, mimeType: 'application/pdf' },
        { id: 'a2', filename: 'IBAN_QR.png', size: 12288, mimeType: 'image/png' },
      ],
      created: '2024-01-15T10:00:00Z',
      modified: '2024-06-20T14:30:00Z',
      accessed: '2024-07-01T09:15:00Z',
      expiryTime: null,
      isExpired: false,
    },
    {
      id: 'e2',
      title: 'Gmail',
      username: 'max.mustermann@gmail.com',
      password: 'Gm@il_S3cure!Pass',
      url: 'https://mail.google.com',
      notes: 'Persönliche E-Mail',
      icon: 0,
      tags: ['email', '2fa'],
      groupId: 'g2',
      customFields: [
        { name: '2FA Recovery', value: 'ABCD-EFGH-IJKL-MNOP', protected: true },
      ],
      attachments: [],
      created: '2023-03-10T08:00:00Z',
      modified: '2024-05-15T16:45:00Z',
      accessed: '2024-07-01T10:00:00Z',
      expiryTime: null,
      isExpired: false,
    },
    {
      id: 'e3',
      title: 'GitHub',
      username: 'maxmustermann',
      password: 'G1tHub$ecure!2024',
      url: 'https://github.com',
      notes: 'Development account',
      icon: 0,
      tags: ['dev', '2fa', 'arbeit'],
      groupId: 'g4',
      customFields: [
        { name: 'TOTP Secret', value: 'JBSWY3DPEHPK3PXP', protected: true },
        { name: 'SSH Key Fingerprint', value: 'SHA256:abc123def456', protected: false },
      ],
      attachments: [
        { id: 'a3', filename: 'ssh_key_backup.zip', size: 4096, mimeType: 'application/zip' },
      ],
      created: '2023-01-05T12:00:00Z',
      modified: '2024-04-10T11:20:00Z',
      accessed: '2024-07-01T08:00:00Z',
      expiryTime: null,
      isExpired: false,
    },
    {
      id: 'e4',
      title: 'Amazon',
      username: 'max@mustermann.de',
      password: 'Amaz0n_Pr1me!Shop',
      url: 'https://www.amazon.de',
      notes: '',
      icon: 0,
      tags: ['shopping'],
      groupId: 'g5',
      customFields: [],
      attachments: [],
      created: '2023-06-20T15:00:00Z',
      modified: '2024-03-01T09:30:00Z',
      accessed: '2024-06-28T20:00:00Z',
      expiryTime: null,
      isExpired: false,
    },
    {
      id: 'e5',
      title: 'Slack (Firma)',
      username: 'max.mustermann@firma.de',
      password: 'Sl@ck_W0rk!Pass2024',
      url: 'https://firma.slack.com',
      notes: 'Firmen-Slack Account',
      icon: 0,
      tags: ['arbeit'],
      groupId: 'g4',
      customFields: [],
      attachments: [],
      created: '2024-02-01T09:00:00Z',
      modified: '2024-06-15T10:00:00Z',
      accessed: '2024-07-01T08:30:00Z',
      expiryTime: null,
      isExpired: false,
    },
    {
      id: 'e6',
      title: 'Netflix',
      username: 'max@mustermann.de',
      password: 'N3tfl1x_Str3am!',
      url: 'https://www.netflix.com',
      notes: 'Familien-Account',
      icon: 0,
      tags: ['streaming'],
      groupId: 'g5',
      customFields: [
        { name: 'Plan', value: 'Premium 4K', protected: false },
      ],
      attachments: [],
      created: '2023-08-10T18:00:00Z',
      modified: '2024-01-15T12:00:00Z',
      accessed: '2024-06-30T21:00:00Z',
      expiryTime: null,
      isExpired: false,
    },
  ])

  database.setLastSaved(new Date(Date.now() - 120000))
}

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

function App() {
  const showSidebar = useSettingsStore((s) => s.showSidebar)
  const showPreviewPanel = useSettingsStore((s) => s.showPreviewPanel)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    loadDemoData()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        setShowGenerator((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <MenuBar />
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <aside className={cn(
            'w-[200px] shrink-0 border-r border-[rgb(var(--color-border))]',
            'bg-[rgb(var(--color-background-secondary))]'
          )}>
            <GroupTree />
          </aside>
        )}

        <div className={cn(
          'w-[400px] shrink-0 border-r border-[rgb(var(--color-border))]',
          'bg-[rgb(var(--color-background))]'
        )}>
          <EntryList />
        </div>

        {showPreviewPanel && (
          <main className="flex-1 min-w-0 bg-[rgb(var(--color-background))]">
            <EntryPreview />
          </main>
        )}
      </div>

      <StatusBar />

      {showGenerator && <GeneratorDialog onClose={() => setShowGenerator(false)} />}
    </div>
  )
}

export default App
