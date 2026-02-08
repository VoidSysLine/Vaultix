import { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

interface MenuItem {
  label: string
  shortcut?: string
  action?: string
  type?: 'separator'
  submenu?: MenuItem[]
  icon?: string
}

const menuStructure: Record<string, MenuItem[]> = {
  Datei: [
    { label: 'Neue Datenbank...', shortcut: 'Ctrl+N', action: 'newDatabase' },
    { label: 'Datenbank öffnen...', shortcut: 'Ctrl+O', action: 'openDatabase' },
    { label: 'Letzte Datenbanken', submenu: [] },
    { type: 'separator', label: '' },
    { label: 'Datenbank speichern', shortcut: 'Ctrl+S', action: 'saveDatabase' },
    { label: 'Datenbank speichern als...', shortcut: 'Ctrl+Shift+S', action: 'saveAs' },
    { label: 'Datenbank schließen', shortcut: 'Ctrl+W', action: 'closeDatabase' },
    { type: 'separator', label: '' },
    { label: 'Exportieren', submenu: [
      { label: 'Als CSV...', action: 'exportCSV' },
      { label: 'Als HTML...', action: 'exportHTML' },
    ]},
    { label: 'Importieren', submenu: [
      { label: 'Aus CSV...', action: 'importCSV' },
      { label: 'Aus Bitwarden...', action: 'importBitwarden' },
      { label: 'Aus LastPass...', action: 'importLastPass' },
    ]},
    { type: 'separator', label: '' },
    { label: 'Beenden', shortcut: 'Ctrl+Q', action: 'quit' },
  ],
  Bearbeiten: [
    { label: 'Neuer Eintrag', shortcut: 'Ctrl+N', action: 'newEntry' },
    { label: 'Neue Gruppe', shortcut: 'Ctrl+Shift+N', action: 'newGroup' },
    { type: 'separator', label: '' },
    { label: 'Eintrag bearbeiten', shortcut: 'Ctrl+E', action: 'editEntry' },
    { label: 'Eintrag löschen', shortcut: 'Delete', action: 'deleteEntry' },
    { label: 'Eintrag duplizieren', shortcut: 'Ctrl+D', action: 'duplicateEntry' },
    { type: 'separator', label: '' },
    { label: 'Benutzername kopieren', shortcut: 'Ctrl+B', action: 'copyUsername' },
    { label: 'Passwort kopieren', shortcut: 'Ctrl+C', action: 'copyPassword' },
    { label: 'URL öffnen', shortcut: 'Ctrl+U', action: 'openUrl' },
    { type: 'separator', label: '' },
    { label: 'Suchen...', shortcut: 'Ctrl+F', action: 'search' },
  ],
  Ansicht: [
    { label: 'Seitenleiste', shortcut: 'Ctrl+B', action: 'toggleSidebar' },
    { label: 'Vorschau-Panel', action: 'togglePreview' },
    { type: 'separator', label: '' },
    { label: 'Vollbild', shortcut: 'F11', action: 'fullscreen' },
    { type: 'separator', label: '' },
    { label: 'Sortierung', submenu: [
      { label: 'Nach Titel', action: 'sortByTitle' },
      { label: 'Nach Benutzername', action: 'sortByUsername' },
      { label: 'Nach Änderungsdatum', action: 'sortByModified' },
    ]},
  ],
  Tools: [
    { label: 'Passwort-Generator', shortcut: 'Ctrl+G', action: 'passwordGenerator' },
    { label: 'Passphrase-Generator', action: 'passphraseGenerator' },
    { label: 'PIN-Generator', action: 'pinGenerator' },
    { type: 'separator', label: '' },
    { label: 'Sicherheits-Audit', shortcut: 'Ctrl+H', action: 'securityAudit' },
    { type: 'separator', label: '' },
    { label: 'Einstellungen...', shortcut: 'Ctrl+,', action: 'settings' },
  ],
  Hilfe: [
    { label: 'Dokumentation', shortcut: 'F1', action: 'documentation' },
    { label: 'Tastenkombinationen', action: 'keyboardShortcuts' },
    { type: 'separator', label: '' },
    { label: 'Über Vaultix', action: 'about' },
  ],
}

function MenuDropdown({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-0 z-50 min-w-[220px] rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] shadow-lg py-1"
    >
      {items.map((item, i) =>
        item.type === 'separator' ? (
          <div key={i} className="my-1 h-px bg-[rgb(var(--color-border))]" />
        ) : item.submenu ? (
          <SubMenu key={i} item={item} />
        ) : (
          <button
            key={i}
            className="flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-[rgb(var(--color-accent))] transition-colors"
            onClick={() => {
              // TODO: dispatch action
              onClose()
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <kbd className="ml-4 text-xs text-[rgb(var(--color-foreground-muted))] bg-[rgb(var(--color-background-secondary))] px-1.5 py-0.5 rounded">
                {item.shortcut}
              </kbd>
            )}
          </button>
        )
      )}
    </div>
  )
}

function SubMenu({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-[rgb(var(--color-accent))] transition-colors">
        <span>{item.label}</span>
        <span className="text-xs text-[rgb(var(--color-foreground-muted))]">▸</span>
      </button>
      {open && item.submenu && (
        <div className="absolute left-full top-0 min-w-[180px] rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] shadow-lg py-1">
          {item.submenu.map((sub, j) => (
            <button
              key={j}
              className="flex items-center w-full px-3 py-1.5 text-sm hover:bg-[rgb(var(--color-accent))] transition-colors"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={menuBarRef}
      className="h-8 bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))] flex items-center px-2 text-sm font-medium select-none"
    >
      {Object.entries(menuStructure).map(([name, items]) => (
        <div key={name} className="relative">
          <button
            className={cn(
              'px-3 py-1 rounded-sm transition-colors',
              'hover:bg-[rgb(var(--color-accent))]',
              openMenu === name && 'bg-[rgb(var(--color-accent))]'
            )}
            onClick={() => setOpenMenu(openMenu === name ? null : name)}
            onMouseEnter={() => {
              if (openMenu) setOpenMenu(name)
            }}
          >
            {name}
          </button>
          {openMenu === name && (
            <MenuDropdown items={items} onClose={() => setOpenMenu(null)} />
          )}
        </div>
      ))}
    </div>
  )
}
