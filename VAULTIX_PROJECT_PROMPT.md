# 🔐 Vaultix - Next-Gen KeePass Password Manager

## 📋 Projekt-Übersicht

**Vaultix** ist ein moderner, benutzerfreundlicher KeePass-kompatibler Password Manager, der die Schwächen bestehender Lösungen (KeePassXC, KeeWeb) adressiert und eine erstklassige User Experience bietet.

### 🎯 Vision
Ein Password Manager, der:
- ✅ **Alle Custom Properties** direkt in der Preview anzeigt
- ✅ **Attachment Preview** nativ unterstützt (PDF, Bilder, Office-Docs)
- ✅ **Moderne, intuitive UI** mit reaktivem Design bietet
- ✅ **KDBX 4.x** vollständig unterstützt
- ✅ **Cross-Platform** als Flatpak, AppImage, Web-App funktioniert
- ✅ **Offline-First** mit optionalem Cloud-Sync arbeitet
- ✅ **Performant** ist, auch bei tausenden Einträgen

---

## 🏗️ Tech Stack

### **Frontend (UI Layer)**
```
React 18+ (TypeScript)
  ├─ UI Framework: shadcn/ui + Radix UI
  ├─ Styling: Tailwind CSS 4.0
  ├─ State Management: Zustand + React Query
  ├─ Routing: TanStack Router
  ├─ Forms: React Hook Form + Zod
  ├─ Virtual Lists: TanStack Virtual
  ├─ Animation: Framer Motion
  ├─ Icons: Lucide React
  └─ Desktop: Electron (mit Python Backend via IPC)
```

### **Backend (Core Logic)**
```
Python 3.12+
  ├─ KDBX: pykeepass (erweitert)
  ├─ Crypto: cryptography (AES, Argon2, ChaCha20)
  ├─ Database: SQLite (für Indexing/Search)
  ├─ PDF: pypdf, pdf2image
  ├─ Image: Pillow
  ├─ Search: whoosh (Full-Text Search & Indexing)
  ├─ Compression: zlib, gzip
  ├─ FastAPI: REST API für Tauri IPC
  ├─ Password Analysis: zxcvbn-python
  └─ Async I/O: asyncio, aiofiles
```

### **Build & Packaging**
```
Flatpak (primär)
  ├─ Runtime: org.freedesktop.Platform 24.08
  ├─ SDK: org.freedesktop.Sdk
  └─ Permissions: filesystem, network (optional)

AppImage (sekundär)
  ├─ appimagetool
  └─ Electron-Builder Alternative

Web-App (Progressive)
  ├─ Vite + PWA Plugin
  ├─ WASM für Crypto-Operations
  └─ File System Access API
```

---

## 🎨 UI/UX Design Principles

### **Design System**

#### **Color Palette**
```typescript
const colors = {
  // Primary Brand
  primary: {
    50: '#f0f9ff',   // Sehr hell
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Haupt
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',  // Sehr dunkel
  },
  
  // Semantic Colors
  success: '#10b981',    // Grün
  warning: '#f59e0b',    // Orange
  error: '#ef4444',      // Rot
  info: '#3b82f6',       // Blau
  
  // Security Levels
  security: {
    weak: '#ef4444',     // Rot
    medium: '#f59e0b',   // Orange
    strong: '#10b981',   // Grün
    veryStrong: '#059669', // Dunkelgrün
  },
  
  // Dark Mode (Auto-generiert mit Tailwind)
  dark: {
    bg: {
      primary: '#0f172a',   // slate-900
      secondary: '#1e293b', // slate-800
      tertiary: '#334155',  // slate-700
    },
    text: {
      primary: '#f1f5f9',   // slate-100
      secondary: '#cbd5e1', // slate-300
      muted: '#94a3b8',     // slate-400
    }
  }
}
```

#### **Typography**
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter Variable', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
}
```

#### **Spacing System**
```typescript
// Tailwind's 4px base unit
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
}
```

### **Layout-Struktur**

```
┌─────────────────────────────────────────────────────────────────┐
│  Datei  Bearbeiten  Ansicht  Tools  Hilfe                       │ Menüleiste (32px)
├─────────────────────────────────────────────────────────────────┤
│  [Logo] Vaultix          [🔍 Search]        [⚙️] [👤] [🔒]     │ Header (60px)
├──────────────┬──────────────────────┬───────────────────────────┤
│              │                      │                           │
│  Navigation  │   Entry List         │   Preview Panel           │
│              │                      │                           │
│  📁 Gruppen  │  ┌─────────────────┐ │  ┌──────────────────────┐│
│   ├─ Banking │  │ 🏦 Sparkasse    │ │  │ 🏦 Sparkasse Trier   ││
│   ├─ Email   │  │ 📧 Gmail        │ │  │                      ││
│   ├─ Social  │  │ 🔐 GitHub       │ │  │ 👤 Max Mustermann    ││
│   └─ Work    │  │ 💼 Slack        │ │  │ 🔑 ••••••••••        ││
│              │  └─────────────────┘ │  │ 🌐 sparkasse-trier.de││
│  🏷️ Tags     │                      │  │                      ││
│   #wichtig   │  [Sortierung ▼]      │  │ 📋 Custom Fields:    ││
│   #2fa       │  [Filter 🔽]         │  │   IBAN: DE89...      ││
│   #arbeit    │                      │  │   BIC: TRISDE55XXX   ││
│              │                      │  │   Kontonr: 12345678  ││
│              │                      │  │   ...                ││
│              │                      │  │                      ││
│  ⭐ Favoriten│                      │  │ 📎 Attachments:      ││
│              │                      │  │   [PDF Icon] Vertrag ││
│  🗑️ Papierkorb│                      │  │   [IMG] IBAN_QR.png  ││
│              │                      │  │                      ││
│              │                      │  │ 📝 Notes:            ││
│              │                      │  │   Hauptkonto...      ││
│              │                      │  └──────────────────────┘│
│              │                      │                           │
│  200px       │      400-600px       │      600-800px (flex)     │
└──────────────┴──────────────────────┴───────────────────────────┘
                         Status Bar (32px)
              Last Sync: 2 min ago | Entries: 247 | Modified ●
```

### **Menüleiste (Menu Bar)**

```typescript
// Menüstruktur wie KeePassXC
const menuStructure = {
  Datei: [
    { label: 'Neue Datenbank...', shortcut: 'Ctrl+N', action: 'newDatabase' },
    { label: 'Datenbank öffnen...', shortcut: 'Ctrl+O', action: 'openDatabase' },
    { label: 'Letzte Datenbanken', submenu: [] }, // Recent files
    { type: 'separator' },
    { label: 'Datenbank speichern', shortcut: 'Ctrl+S', action: 'saveDatabase' },
    { label: 'Datenbank speichern als...', shortcut: 'Ctrl+Shift+S', action: 'saveAs' },
    { label: 'Datenbank schließen', shortcut: 'Ctrl+W', action: 'closeDatabase' },
    { type: 'separator' },
    { label: 'Datenbank exportieren', submenu: [
      { label: 'Als CSV...', action: 'exportCSV' },
      { label: 'Als HTML...', action: 'exportHTML' },
      { label: 'Als KeePass 1.x...', action: 'exportKDB' },
    ]},
    { label: 'Datenbank importieren', submenu: [
      { label: 'Aus CSV...', action: 'importCSV' },
      { label: 'Aus KeePass 1.x...', action: 'importKDB' },
      { label: 'Aus Bitwarden...', action: 'importBitwarden' },
      { label: 'Aus LastPass...', action: 'importLastPass' },
    ]},
    { type: 'separator' },
    { label: 'Datenbankeinstellungen...', action: 'databaseSettings' },
    { label: 'Master-Passwort ändern...', action: 'changeMasterPassword' },
    { label: 'Datenbank-Sicherheit', submenu: [
      { label: 'Verschlüsselungseinstellungen...', action: 'encryptionSettings' },
      { label: 'Key-Datei verwalten...', action: 'manageKeyFile' },
    ]},
    { type: 'separator' },
    { label: 'Beenden', shortcut: 'Ctrl+Q', action: 'quit' },
  ],
  
  Bearbeiten: [
    { label: 'Neuer Eintrag', shortcut: 'Ctrl+N', action: 'newEntry' },
    { label: 'Neue Gruppe', shortcut: 'Ctrl+Shift+N', action: 'newGroup' },
    { type: 'separator' },
    { label: 'Eintrag bearbeiten', shortcut: 'Ctrl+E', action: 'editEntry' },
    { label: 'Eintrag löschen', shortcut: 'Delete', action: 'deleteEntry' },
    { label: 'Eintrag duplizieren', shortcut: 'Ctrl+D', action: 'duplicateEntry' },
    { type: 'separator' },
    { label: 'Benutzername kopieren', shortcut: 'Ctrl+B', action: 'copyUsername' },
    { label: 'Passwort kopieren', shortcut: 'Ctrl+C', action: 'copyPassword' },
    { label: 'URL öffnen', shortcut: 'Ctrl+U', action: 'openUrl' },
    { type: 'separator' },
    { label: 'Suchen...', shortcut: 'Ctrl+F', action: 'search' },
  ],
  
  Ansicht: [
    { label: 'Symbolleiste', type: 'checkbox', checked: true, action: 'toggleToolbar' },
    { label: 'Seitenleiste', type: 'checkbox', checked: true, action: 'toggleSidebar' },
    { label: 'Vorschau-Panel', type: 'checkbox', checked: true, action: 'togglePreview' },
    { type: 'separator' },
    { label: 'Vollbild', shortcut: 'F11', action: 'fullscreen' },
    { type: 'separator' },
    { label: 'Spalten anpassen...', action: 'customizeColumns' },
    { label: 'Sortierung', submenu: [
      { label: 'Nach Titel', action: 'sortByTitle' },
      { label: 'Nach Benutzername', action: 'sortByUsername' },
      { label: 'Nach Änderungsdatum', action: 'sortByModified' },
      { label: 'Nach Erstelldatum', action: 'sortByCreated' },
    ]},
  ],
  
  Tools: [
    { label: 'Passwort-Generator', shortcut: 'Ctrl+G', action: 'passwordGenerator', icon: '🎲' },
    { label: 'Passphrase-Generator', shortcut: 'Ctrl+Shift+G', action: 'passphraseGenerator', icon: '📝' },
    { label: 'PIN-Generator', action: 'pinGenerator', icon: '🔢' },
    { type: 'separator' },
    { label: 'Sicherheits-Audit', shortcut: 'Ctrl+H', action: 'securityAudit', icon: '🛡️' },
    { type: 'separator' },
    { label: 'Datenbank-Berichte', submenu: [
      { label: 'Statistiken', action: 'statistics' },
      { label: 'Änderungshistorie', action: 'changeHistory' },
      { label: 'Audit-Log', action: 'auditLog' },
    ]},
    { type: 'separator' },
    { label: 'Einstellungen...', shortcut: 'Ctrl+,', action: 'settings', icon: '⚙️' },
  ],
  
  Hilfe: [
    { label: 'Dokumentation', shortcut: 'F1', action: 'documentation' },
    { label: 'Tastenkombinationen', action: 'keyboardShortcuts' },
    { type: 'separator' },
    { label: 'Nach Updates suchen...', action: 'checkUpdates' },
    { label: 'Bug melden...', action: 'reportBug' },
    { type: 'separator' },
    { label: 'Über Vaultix', action: 'about' },
  ],
};
```

### **Menüleiste Styling**

```typescript
// Menu Bar Component
const MenuBar = () => {
  return (
    <div className="
      h-8                           /* 32px Höhe */
      bg-background                 /* Hintergrund */
      border-b border-border        /* Unterer Rand */
      flex items-center             /* Zentriert */
      px-2                          /* Padding links/rechts */
      text-sm                       /* 14px Schriftgröße */
      font-medium                   /* Medium weight */
      select-none                   /* Nicht selektierbar */
    ">
      {Object.keys(menuStructure).map((menuName) => (
        <MenuBarItem key={menuName} label={menuName} items={menuStructure[menuName]} />
      ))}
    </div>
  );
};

// Einzelnes Menü-Item
const MenuBarItem = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="
        px-3 py-1                   /* Padding */
        rounded-sm                  /* Leichte Rundung */
        hover:bg-accent            /* Hover-Effekt */
        hover:text-accent-foreground
        focus:bg-accent
        data-[state=open]:bg-accent
        transition-colors
      ">
        {label}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item, index) => (
          item.type === 'separator' ? (
            <DropdownMenuSeparator key={index} />
          ) : item.submenu ? (
            <DropdownMenuSub key={index}>
              <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {item.submenu.map((subItem, subIndex) => (
                  <DropdownMenuItem key={subIndex} onClick={subItem.action}>
                    {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                    {subItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={index} onClick={item.action}>
              <div className="flex items-center justify-between w-full">
                <span>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
                {item.shortcut && (
                  <kbd className="
                    ml-auto text-xs          /* Klein */
                    text-muted-foreground    /* Gedämpfte Farbe */
                    bg-muted                 /* Hintergrund */
                    px-1.5 py-0.5            /* Padding */
                    rounded                  /* Rundung */
                  ">
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```
│  ⭐ Favoriten│                      │  │   ...                ││
│              │                      │  │                      ││
│  🗑️ Papierkorb│                      │  │ 📎 Attachments:      ││
│              │                      │  │   [PDF Icon] Vertrag ││
│              │                      │  │   [IMG] IBAN_QR.png  ││
│              │                      │  │                      ││
│              │                      │  │ 📝 Notes:            ││
│              │                      │  │   Hauptkonto...      ││
│              │                      │  └──────────────────────┘│
│              │                      │                           │
│  200px       │      400-600px       │      600-800px (flex)     │
└──────────────┴──────────────────────┴───────────────────────────┘
                         Status Bar (32px)
              Last Sync: 2 min ago | Entries: 247 | Modified ●
```

### **Responsive Breakpoints**
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Laptop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large Desktop
}

// Layout Adaptations:
// < 768px:  Sidebar → Drawer, Single Column
// 768-1024px: Two Column (List + Preview)
// > 1024px: Three Column (Sidebar + List + Preview)
```

---

## 🏛️ Software-Architektur

### **Architektur-Pattern: Clean Architecture + Feature-Sliced Design**

```
src/
├─ app/                           # Application Layer
│  ├─ providers/                  # React Context Providers
│  │  ├─ ThemeProvider.tsx
│  │  ├─ AuthProvider.tsx
│  │  ├─ DatabaseProvider.tsx
│  │  └─ NotificationProvider.tsx
│  ├─ routes/                     # Route Definitions
│  │  ├─ _authenticated/          # Protected Routes
│  │  ├─ _public/                 # Public Routes
│  │  └─ index.tsx
│  ├─ App.tsx
│  └─ main.tsx
│
├─ features/                      # Feature Modules (FSD)
│  ├─ auth/
│  │  ├─ components/
│  │  │  ├─ LoginForm.tsx
│  │  │  ├─ MasterPasswordInput.tsx
│  │  │  └─ BiometricUnlock.tsx
│  │  ├─ hooks/
│  │  │  ├─ useAuth.ts
│  │  │  └─ useUnlock.ts
│  │  ├─ store/
│  │  │  └─ authStore.ts         # Zustand Store
│  │  ├─ api/
│  │  │  └─ authApi.ts
│  │  └─ types/
│  │     └─ auth.types.ts
│  │
│  ├─ database/
│  │  ├─ components/
│  │  │  ├─ DatabasePicker.tsx
│  │  │  ├─ DatabaseInfo.tsx
│  │  │  └─ NewDatabaseWizard.tsx
│  │  ├─ hooks/
│  │  │  ├─ useDatabase.ts
│  │  │  └─ useDatabaseSync.ts
│  │  ├─ store/
│  │  │  └─ databaseStore.ts
│  │  └─ services/
│  │     ├─ kdbxParser.ts
│  │     └─ kdbxWriter.ts
│  │
│  ├─ entries/
│  │  ├─ components/
│  │  │  ├─ EntryList/
│  │  │  │  ├─ EntryList.tsx      # Virtual List
│  │  │  │  ├─ EntryItem.tsx
│  │  │  │  └─ EntryListHeader.tsx
│  │  │  ├─ EntryPreview/
│  │  │  │  ├─ EntryPreview.tsx
│  │  │  │  ├─ FieldsSection.tsx
│  │  │  │  ├─ CustomFieldsSection.tsx
│  │  │  │  ├─ AttachmentsSection.tsx
│  │  │  │  └─ NotesSection.tsx
│  │  │  ├─ EntryEditor/
│  │  │  │  ├─ EntryEditor.tsx
│  │  │  │  ├─ FieldEditor.tsx
│  │  │  │  └─ AttachmentUploader.tsx
│  │  │  └─ EntryActions/
│  │  │     ├─ CopyButton.tsx
│  │  │     ├─ OpenUrlButton.tsx
│  │  │     └─ DeleteButton.tsx
│  │  ├─ hooks/
│  │  │  ├─ useEntries.ts
│  │  │  ├─ useEntryEditor.ts
│  │  │  └─ useEntrySearch.ts
│  │  ├─ store/
│  │  │  ├─ entriesStore.ts
│  │  │  └─ selectedEntryStore.ts
│  │  └─ types/
│  │     └─ entry.types.ts
│  │
│  ├─ groups/
│  │  ├─ components/
│  │  │  ├─ GroupTree.tsx
│  │  │  ├─ GroupNode.tsx
│  │  │  └─ GroupEditor.tsx
│  │  ├─ hooks/
│  │  │  └─ useGroups.ts
│  │  └─ store/
│  │     └─ groupsStore.ts
│  │
│  ├─ search/
│  │  ├─ components/
│  │  │  ├─ SearchBar.tsx
│  │  │  ├─ SearchFilters.tsx
│  │  │  └─ SearchResults.tsx
│  │  ├─ hooks/
│  │  │  └─ useSearch.ts
│  │  └─ services/
│  │     └─ searchEngine.ts      # Fuzzy Search + Indexing
│  │
│  ├─ attachments/
│  │  ├─ components/
│  │  │  ├─ AttachmentPreview.tsx
│  │  │  ├─ PDFViewer.tsx
│  │  │  ├─ ImageViewer.tsx
│  │  │  └─ DocumentViewer.tsx
│  │  ├─ hooks/
│  │  │  └─ useAttachment.ts
│  │  └─ services/
│  │     ├─ pdfRenderer.ts
│  │     └─ imageProcessor.ts
│  │
│  ├─ generator/
│  │  ├─ components/
│  │  │  ├─ PasswordGenerator.tsx
│  │  │  ├─ PassphraseGenerator.tsx
│  │  │  ├─ PinGenerator.tsx
│  │  │  ├─ StrengthMeter.tsx
│  │  │  └─ GeneratorSettings.tsx
│  │  ├─ hooks/
│  │  │  ├─ usePasswordGenerator.ts
│  │  │  ├─ usePassphraseGenerator.ts
│  │  │  └─ usePinGenerator.ts
│  │  ├─ services/
│  │  │  ├─ passwordService.ts
│  │  │  ├─ passphraseService.ts
│  │  │  └─ pinService.ts
│  │  └─ utils/
│  │     ├─ passwordStrength.ts
│  │     ├─ passwordRules.ts
│  │     └─ entropyCalculator.ts
│  │
│  ├─ security-audit/
│  │  ├─ components/
│  │  │  ├─ PasswordHealthDashboard.tsx
│  │  │  ├─ WeakPasswordsList.tsx
│  │  │  ├─ DuplicatePasswordsList.tsx
│  │  │  ├─ ReusedPasswordsList.tsx
│  │  │  ├─ ExpiredEntriesList.tsx
│  │  │  ├─ SecurityScoreCard.tsx
│  │  │  └─ AuditReport.tsx
│  │  ├─ hooks/
│  │  │  ├─ usePasswordAudit.ts
│  │  │  ├─ useDuplicateDetection.ts
│  │  │  └─ useSecurityScore.ts
│  │  ├─ services/
│  │  │  ├─ auditService.ts
│  │  │  ├─ duplicateDetector.ts
│  │  │  ├─ strengthAnalyzer.ts     # zxcvbn integration
│  │  │  └─ breachChecker.ts         # HaveIBeenPwned API
│  │  └─ types/
│  │     ├─ audit.types.ts
│  │     └─ health.types.ts
│  │
│  ├─ reports/
│  │  ├─ components/
│  │  │  ├─ StatisticsDashboard.tsx
│  │  │  ├─ ChangeHistoryViewer.tsx
│  │  │  ├─ AuditLogViewer.tsx
│  │  │  └─ ExportReportDialog.tsx
│  │  ├─ hooks/
│  │  │  ├─ useStatistics.ts
│  │  │  └─ useAuditLog.ts
│  │  └─ services/
│  │     ├─ statisticsService.ts
│  │     └─ reportGenerator.ts
│  │
│  └─ settings/
│     ├─ components/
│     │  ├─ SettingsPanel.tsx
│     │  ├─ SecuritySettings.tsx
│     │  ├─ AppearanceSettings.tsx
│     │  └─ SyncSettings.tsx
│     └─ store/
│        └─ settingsStore.ts
│
├─ shared/                        # Shared Resources
│  ├─ ui/                         # shadcn/ui components
│  │  ├─ button.tsx
│  │  ├─ input.tsx
│  │  ├─ dialog.tsx
│  │  ├─ dropdown-menu.tsx
│  │  ├─ tabs.tsx
│  │  ├─ card.tsx
│  │  └─ ...
│  ├─ components/                 # Custom Shared Components
│  │  ├─ ProtectedField.tsx       # Password field with show/hide
│  │  ├─ CopyableField.tsx
│  │  ├─ IconPicker.tsx
│  │  ├─ ColorPicker.tsx
│  │  └─ ...
│  ├─ hooks/
│  │  ├─ useClipboard.ts
│  │  ├─ useDebounce.ts
│  │  ├─ useHotkeys.ts
│  │  └─ useLocalStorage.ts
│  ├─ utils/
│  │  ├─ cn.ts                    # Tailwind class merger
│  │  ├─ formatters.ts
│  │  ├─ validators.ts
│  │  └─ crypto.ts
│  ├─ constants/
│  │  ├─ routes.ts
│  │  ├─ icons.ts
│  │  └─ config.ts
│  └─ types/
│     ├─ common.types.ts
│     └─ kdbx.types.ts
│
├─ entities/                      # Domain Models
│  ├─ Entry/
│  │  ├─ model/
│  │  │  ├─ Entry.ts
│  │  │  └─ Field.ts
│  │  └─ lib/
│  │     └─ validation.ts
│  ├─ Group/
│  │  └─ model/
│  │     └─ Group.ts
│  └─ Database/
│     └─ model/
│        └─ Database.ts
│
└─ backend/                       # Python Backend (FastAPI)
   ├─ app/
   │  ├─ main.py                  # FastAPI Application
   │  ├─ config.py                # Configuration
   │  └─ dependencies.py          # DI Container
   │
   ├─ api/                        # API Endpoints
   │  ├─ __init__.py
   │  ├─ database.py              # Database operations
   │  ├─ entries.py               # Entry CRUD
   │  ├─ groups.py                # Group operations
   │  ├─ attachments.py           # Attachment handling
   │  ├─ generator.py             # Password/PIN generation
   │  ├─ audit.py                 # Security audit endpoints
   │  └─ export.py                # Import/Export
   │
   ├─ core/                       # Core Business Logic
   │  ├─ kdbx/
   │  │  ├─ __init__.py
   │  │  ├─ parser.py             # KDBX parsing (pykeepass)
   │  │  ├─ writer.py             # KDBX writing
   │  │  ├─ crypto.py             # Encryption/Decryption
   │  │  └─ compression.py        # Compression handling
   │  │
   │  ├─ search/
   │  │  ├─ __init__.py
   │  │  ├─ indexer.py            # Whoosh indexing
   │  │  ├─ fuzzy_search.py       # Fuzzy matching
   │  │  └─ filters.py            # Search filters
   │  │
   │  ├─ security/
   │  │  ├─ __init__.py
   │  │  ├─ strength_analyzer.py  # zxcvbn integration
   │  │  ├─ duplicate_detector.py # Find duplicates
   │  │  ├─ breach_checker.py     # HaveIBeenPwned API
   │  │  └─ audit_service.py      # Security audit logic
   │  │
   │  ├─ generators/
   │  │  ├─ __init__.py
   │  │  ├─ password.py           # Password generation
   │  │  ├─ passphrase.py         # Passphrase (Diceware/EFF)
   │  │  ├─ pin.py                # PIN generation
   │  │  └─ strength.py           # Strength calculation
   │  │
   │  └─ attachments/
   │     ├─ __init__.py
   │     ├─ pdf_processor.py      # pypdf, pdf2image
   │     ├─ image_processor.py    # Pillow
   │     └─ file_handler.py       # Generic file ops
   │
   ├─ models/                     # Pydantic Models
   │  ├─ __init__.py
   │  ├─ database.py
   │  ├─ entry.py
   │  ├─ group.py
   │  ├─ attachment.py
   │  └─ audit.py
   │
   ├─ services/                   # Business Services
   │  ├─ __init__.py
   │  ├─ database_service.py
   │  ├─ entry_service.py
   │  ├─ audit_service.py
   │  ├─ generator_service.py
   │  └─ export_service.py
   │
   ├─ utils/
   │  ├─ __init__.py
   │  ├─ crypto.py                # Crypto utilities
   │  ├─ validators.py            # Input validation
   │  └─ formatters.py            # Data formatting
   │
   └─ tests/
      ├─ unit/
      ├─ integration/
      └─ conftest.py
```

---

## 🎯 Design Patterns & Principles

### **1. SOLID Principles**

#### **Single Responsibility Principle (SRP)**
```typescript
// ❌ BAD: God Component
function EntryManager() {
  // Handles: fetching, editing, deleting, searching, rendering
}

// ✅ GOOD: Separated Concerns
function EntryList() { /* nur Anzeige */ }
function EntryEditor() { /* nur Bearbeitung */ }
function useEntries() { /* nur Datenzugriff */ }
function useEntrySearch() { /* nur Suche */ }
```

#### **Open/Closed Principle (OCP)**
```typescript
// ✅ Erweiterbar ohne Modifikation
interface FieldRenderer {
  canRender(field: Field): boolean;
  render(field: Field): ReactNode;
}

class PasswordFieldRenderer implements FieldRenderer { }
class TOTPFieldRenderer implements FieldRenderer { }
class CustomFieldRenderer implements FieldRenderer { }

// Neue Feldtypen können hinzugefügt werden ohne bestehenden Code zu ändern
```

#### **Liskov Substitution Principle (LSP)**
```typescript
// ✅ Alle Database-Provider sind austauschbar
interface DatabaseProvider {
  open(path: string, password: string): Promise<Database>;
  save(database: Database): Promise<void>;
  close(): Promise<void>;
}

class LocalDatabaseProvider implements DatabaseProvider { }
class CloudDatabaseProvider implements DatabaseProvider { }
```

#### **Interface Segregation Principle (ISP)**
```typescript
// ✅ Kleine, spezifische Interfaces
interface Readable { read(): Promise<Entry[]>; }
interface Writable { write(entries: Entry[]): Promise<void>; }
interface Searchable { search(query: string): Promise<Entry[]>; }

// Clients implementieren nur was sie brauchen
class ReadOnlyDatabase implements Readable { }
class FullDatabase implements Readable, Writable, Searchable { }
```

#### **Dependency Inversion Principle (DIP)**
```typescript
// ✅ Abhängig von Abstraktion, nicht Konkretisierung
interface CryptoService {
  encrypt(data: Uint8Array, key: Uint8Array): Uint8Array;
  decrypt(data: Uint8Array, key: Uint8Array): Uint8Array;
}

// High-level Modul hängt von Interface ab
class DatabaseManager {
  constructor(private crypto: CryptoService) { }
}

// Implementierungen können gewechselt werden
class AESCrypto implements CryptoService { }
class ChaCha20Crypto implements CryptoService { }
```

### **2. Entwurfsmuster (Design Patterns)**

#### **Creational Patterns**

**Factory Pattern** - Entry Creation
```typescript
class EntryFactory {
  createEntry(type: EntryType): Entry {
    switch (type) {
      case 'login':
        return new LoginEntry();
      case 'card':
        return new CreditCardEntry();
      case 'note':
        return new SecureNoteEntry();
      case 'custom':
        return new CustomEntry();
    }
  }
}
```

**Builder Pattern** - Entry Builder
```typescript
class EntryBuilder {
  private entry: Entry = new Entry();
  
  setTitle(title: string): this {
    this.entry.title = title;
    return this;
  }
  
  setUsername(username: string): this {
    this.entry.username = username;
    return this;
  }
  
  addCustomField(name: string, value: string, protected: boolean): this {
    this.entry.customFields.push({ name, value, protected });
    return this;
  }
  
  build(): Entry {
    return this.entry;
  }
}

// Usage:
const entry = new EntryBuilder()
  .setTitle('GitHub')
  .setUsername('max.mustermann')
  .addCustomField('2FA', 'TOTP_SECRET', true)
  .build();
```

**Singleton Pattern** - Database Instance
```typescript
class DatabaseManager {
  private static instance: DatabaseManager;
  private database: Database | null = null;
  
  private constructor() {}
  
  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }
  
  async openDatabase(path: string, password: string): Promise<Database> {
    if (!this.database) {
      this.database = await openKdbx(path, password);
    }
    return this.database;
  }
}
```

#### **Structural Patterns**

**Adapter Pattern** - KDBX Format Compatibility
```typescript
// Legacy KDBX 3.x
interface KdbxV3Database {
  getGroups(): V3Group[];
  getEntries(): V3Entry[];
}

// Adapter für KDBX 3.x → Modern Format
class Kdbxv3Adapter implements Database {
  constructor(private v3db: KdbxV3Database) {}
  
  getGroups(): Group[] {
    return this.v3db.getGroups().map(g => this.convertGroup(g));
  }
  
  getEntries(): Entry[] {
    return this.v3db.getEntries().map(e => this.convertEntry(e));
  }
  
  private convertGroup(v3group: V3Group): Group { /* ... */ }
  private convertEntry(v3entry: V3Entry): Entry { /* ... */ }
}
```

**Decorator Pattern** - Entry Encryption
```typescript
interface EntryComponent {
  getData(): string;
}

class BasicEntry implements EntryComponent {
  constructor(private data: string) {}
  getData(): string { return this.data; }
}

class EncryptedEntry implements EntryComponent {
  constructor(
    private entry: EntryComponent,
    private crypto: CryptoService
  ) {}
  
  getData(): string {
    const data = this.entry.getData();
    return this.crypto.decrypt(data);
  }
}

class CompressedEntry implements EntryComponent {
  constructor(private entry: EntryComponent) {}
  
  getData(): string {
    const data = this.entry.getData();
    return decompress(data);
  }
}

// Usage: Kombinierbar
const entry = new CompressedEntry(
  new EncryptedEntry(
    new BasicEntry(rawData),
    cryptoService
  )
);
```

**Facade Pattern** - Simplified KDBX API
```typescript
// Komplexes System
class KdbxParser { }
class CryptoService { }
class CompressionService { }
class IndexService { }

// Facade für einfachen Zugriff
class VaultixDatabase {
  private parser = new KdbxParser();
  private crypto = new CryptoService();
  private compression = new CompressionService();
  private indexer = new IndexService();
  
  async open(path: string, password: string): Promise<Database> {
    const encrypted = await fs.readFile(path);
    const decrypted = await this.crypto.decrypt(encrypted, password);
    const decompressed = await this.compression.decompress(decrypted);
    const database = await this.parser.parse(decompressed);
    await this.indexer.index(database);
    return database;
  }
  
  async save(database: Database, path: string): Promise<void> {
    const serialized = await this.parser.serialize(database);
    const compressed = await this.compression.compress(serialized);
    const encrypted = await this.crypto.encrypt(compressed);
    await fs.writeFile(path, encrypted);
  }
}
```

#### **Behavioral Patterns**

**Observer Pattern** - Database Change Notifications
```typescript
class DatabaseSubject {
  private observers: Observer[] = [];
  
  subscribe(observer: Observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  notify(event: DatabaseEvent) {
    this.observers.forEach(observer => observer.update(event));
  }
}

// React Integration
function useDatabase() {
  const [database, setDatabase] = useState<Database | null>(null);
  
  useEffect(() => {
    const observer = {
      update: (event: DatabaseEvent) => {
        if (event.type === 'ENTRY_UPDATED') {
          setDatabase(prev => ({ ...prev, ...event.data }));
        }
      }
    };
    
    databaseSubject.subscribe(observer);
    return () => databaseSubject.unsubscribe(observer);
  }, []);
  
  return database;
}
```

**Strategy Pattern** - Password/Passphrase/PIN Generation Strategies
```typescript
// Base Strategy Interface
interface GeneratorStrategy {
  generate(options: GeneratorOptions): string;
  validate(options: GeneratorOptions): boolean;
  estimateEntropy(options: GeneratorOptions): number;
}

// Password Strategies
class RandomPasswordStrategy implements GeneratorStrategy {
  generate(options: PasswordOptions): string {
    const { length, uppercase, lowercase, numbers, symbols, excludeSimilar } = options;
    let charset = '';
    
    if (lowercase) charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += excludeSimilar ? '23456789' : '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    return Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map(x => charset[x % charset.length])
      .join('');
  }
  
  estimateEntropy(options: PasswordOptions): number {
    let charsetSize = 0;
    if (options.lowercase) charsetSize += 26;
    if (options.uppercase) charsetSize += 26;
    if (options.numbers) charsetSize += 10;
    if (options.symbols) charsetSize += 32;
    return Math.log2(Math.pow(charsetSize, options.length));
  }
}

class PronounceablePasswordStrategy implements GeneratorStrategy {
  private consonants = 'bcdfghjklmnprstvwxz';
  private vowels = 'aeiou';
  
  generate(options: PasswordOptions): string {
    let password = '';
    const syllables = Math.ceil(options.length / 3);
    
    for (let i = 0; i < syllables; i++) {
      password += this.randomChar(this.consonants);
      password += this.randomChar(this.vowels);
      if (options.numbers && i % 2 === 0) {
        password += this.randomChar('0123456789');
      } else {
        password += this.randomChar(this.consonants);
      }
    }
    
    return password.slice(0, options.length);
  }
  
  private randomChar(charset: string): string {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  }
}

// Passphrase Strategies
class DicewarePassphraseStrategy implements GeneratorStrategy {
  private wordlist: string[] = []; // EFF Long Wordlist (7776 words)
  
  async loadWordlist() {
    // Load from assets/wordlists/eff_large_wordlist.txt
    this.wordlist = await fetch('/wordlists/eff_large.txt')
      .then(r => r.text())
      .then(t => t.split('\n'));
  }
  
  generate(options: PassphraseOptions): string {
    const words: string[] = [];
    
    for (let i = 0; i < options.wordCount; i++) {
      // 5 dice rolls (d6) = 6^5 = 7776 combinations
      const diceRolls = Array.from(crypto.getRandomValues(new Uint8Array(5)))
        .map(x => (x % 6) + 1)
        .join('');
      const index = parseInt(diceRolls, 10) - 11111; // Wordlist starts at 11111
      words.push(this.wordlist[index]);
    }
    
    return words.join(options.separator);
  }
  
  estimateEntropy(options: PassphraseOptions): number {
    // log2(7776^wordCount)
    return options.wordCount * Math.log2(7776);
  }
}

class RandomWordPassphraseStrategy implements GeneratorStrategy {
  generate(options: PassphraseOptions): string {
    const adjectives = ['quick', 'lazy', 'happy', 'bright', 'silent', /* ... */];
    const nouns = ['fox', 'dog', 'cat', 'bird', 'tree', /* ... */];
    const verbs = ['jumps', 'runs', 'flies', 'swims', 'climbs', /* ... */];
    
    const words: string[] = [];
    for (let i = 0; i < options.wordCount; i++) {
      const wordType = i % 3;
      const list = wordType === 0 ? adjectives : wordType === 1 ? nouns : verbs;
      words.push(this.randomItem(list));
    }
    
    if (options.capitalize) {
      words.forEach((w, i) => words[i] = w.charAt(0).toUpperCase() + w.slice(1));
    }
    
    if (options.includeNumber) {
      words.push(Math.floor(Math.random() * 10000).toString());
    }
    
    return words.join(options.separator);
  }
  
  private randomItem<T>(array: T[]): T {
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % array.length;
    return array[idx];
  }
}

// PIN Strategies
class NumericPinStrategy implements GeneratorStrategy {
  generate(options: PinOptions): string {
    const length = options.length || 4;
    const excludeSequential = options.excludeSequential || false;
    
    let pin: string;
    do {
      pin = Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => x % 10)
        .join('');
    } while (excludeSequential && this.isSequential(pin));
    
    return pin;
  }
  
  private isSequential(pin: string): boolean {
    // Check for sequences like 1234, 4321, 1111
    const digits = pin.split('').map(Number);
    
    // All same
    if (new Set(digits).size === 1) return true;
    
    // Ascending
    if (digits.every((d, i) => i === 0 || d === digits[i-1] + 1)) return true;
    
    // Descending  
    if (digits.every((d, i) => i === 0 || d === digits[i-1] - 1)) return true;
    
    return false;
  }
  
  estimateEntropy(options: PinOptions): number {
    return options.length * Math.log2(10);
  }
}

// Unified Generator with Strategy Selection
class UnifiedGenerator {
  private strategies = {
    password: {
      random: new RandomPasswordStrategy(),
      pronounceable: new PronounceablePasswordStrategy(),
    },
    passphrase: {
      diceware: new DicewarePassphraseStrategy(),
      randomWords: new RandomWordPassphraseStrategy(),
    },
    pin: {
      numeric: new NumericPinStrategy(),
    },
  };
  
  generate(type: 'password' | 'passphrase' | 'pin', strategy: string, options: any): string {
    const selectedStrategy = this.strategies[type][strategy];
    if (!selectedStrategy) {
      throw new Error(`Unknown strategy: ${type}.${strategy}`);
    }
    return selectedStrategy.generate(options);
  }
  
  getEntropy(type: string, strategy: string, options: any): number {
    const selectedStrategy = this.strategies[type][strategy];
    return selectedStrategy.estimateEntropy(options);
  }
}

// Usage in Components:
const generator = new UnifiedGenerator();

// Password
const password = generator.generate('password', 'random', {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
});

// Passphrase
const passphrase = generator.generate('passphrase', 'diceware', {
  wordCount: 6,
  separator: '-',
});

// PIN
const pin = generator.generate('pin', 'numeric', {
  length: 6,
  excludeSequential: true,
});
```

**Command Pattern** - Undo/Redo
```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class CreateEntryCommand implements Command {
  constructor(
    private database: Database,
    private entry: Entry,
    private group: Group
  ) {}
  
  execute() {
    this.group.addEntry(this.entry);
  }
  
  undo() {
    this.group.removeEntry(this.entry);
  }
}

class UpdateEntryCommand implements Command {
  private oldEntry: Entry;
  
  constructor(
    private entry: Entry,
    private newData: Partial<Entry>
  ) {
    this.oldEntry = { ...entry };
  }
  
  execute() {
    Object.assign(this.entry, this.newData);
  }
  
  undo() {
    Object.assign(this.entry, this.oldEntry);
  }
}

class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;
  
  execute(command: Command) {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }
  
  undo() {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }
  
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}
```

**State Pattern** - Database States
```typescript
interface DatabaseState {
  open(): void;
  save(): void;
  close(): void;
}

class LockedState implements DatabaseState {
  open() { /* Unlock dialog */ }
  save() { throw new Error('Database locked'); }
  close() { /* Already closed */ }
}

class OpenState implements DatabaseState {
  open() { /* Already open */ }
  save() { /* Save to disk */ }
  close() { /* Lock database */ }
}

class DirtyState implements DatabaseState {
  open() { /* Already open */ }
  save() { /* Save changes */ }
  close() { /* Confirm unsaved changes */ }
}

class DatabaseContext {
  private state: DatabaseState = new LockedState();
  
  setState(state: DatabaseState) {
    this.state = state;
  }
  
  open() { this.state.open(); }
  save() { this.state.save(); }
  close() { this.state.close(); }
}
```

---

## 🔧 React Patterns & Best Practices

### **1. Custom Hooks Pattern**

```typescript
// ✅ Wiederverwendbare Logik in Custom Hooks
function useEntry(entryId: string) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function loadEntry() {
      try {
        setLoading(true);
        const data = await getEntry(entryId);
        if (!cancelled) setEntry(data);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    loadEntry();
    
    return () => { cancelled = true; };
  }, [entryId]);
  
  const updateEntry = useCallback(async (updates: Partial<Entry>) => {
    if (!entry) return;
    
    try {
      const updated = await saveEntry(entryId, updates);
      setEntry(updated);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [entryId, entry]);
  
  return { entry, loading, error, updateEntry };
}
```

### **2. Compound Components Pattern**

```typescript
// ✅ Flexible, wiederverwendbare Component API
interface EntryCardContextValue {
  entry: Entry;
  isEditing: boolean;
  toggleEdit: () => void;
}

const EntryCardContext = createContext<EntryCardContextValue | null>(null);

function EntryCard({ entry, children }: EntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(prev => !prev);
  
  return (
    <EntryCardContext.Provider value={{ entry, isEditing, toggleEdit }}>
      <div className="entry-card">
        {children}
      </div>
    </EntryCardContext.Provider>
  );
}

function EntryCardHeader() {
  const { entry, isEditing } = useContext(EntryCardContext)!;
  return <div className="header">{isEditing ? 'Editing' : entry.title}</div>;
}

function EntryCardBody() {
  const { entry, isEditing } = useContext(EntryCardContext)!;
  return isEditing ? <EntryEditor entry={entry} /> : <EntryPreview entry={entry} />;
}

function EntryCardActions() {
  const { toggleEdit } = useContext(EntryCardContext)!;
  return <button onClick={toggleEdit}>Edit</button>;
}

// Zusammensetzen als Compound Component
EntryCard.Header = EntryCardHeader;
EntryCard.Body = EntryCardBody;
EntryCard.Actions = EntryCardActions;

// Usage:
<EntryCard entry={entry}>
  <EntryCard.Header />
  <EntryCard.Body />
  <EntryCard.Actions />
</EntryCard>
```

### **3. Render Props Pattern**

```typescript
// ✅ Flexibles Rendering mit Render Props
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  children: (item: T, index: number) => ReactNode;
}

function VirtualList<T>({ items, itemHeight, children }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 600;
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div 
      className="virtual-list"
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {children(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage:
<VirtualList items={entries} itemHeight={60}>
  {(entry, index) => <EntryItem entry={entry} index={index} />}
</VirtualList>
```

### **4. Container/Presenter Pattern**

```typescript
// ✅ Logik (Container) getrennt von UI (Presenter)

// Presenter: Pure UI Component
interface EntryListPresenterProps {
  entries: Entry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function EntryListPresenter({ 
  entries, 
  selectedId, 
  onSelect, 
  onDelete 
}: EntryListPresenterProps) {
  return (
    <div className="entry-list">
      {entries.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          selected={entry.id === selectedId}
          onSelect={() => onSelect(entry.id)}
          onDelete={() => onDelete(entry.id)}
        />
      ))}
    </div>
  );
}

// Container: Business Logic
function EntryListContainer() {
  const { entries, loading } = useEntries();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deleteEntry = useDeleteEntry();
  
  if (loading) return <Spinner />;
  
  return (
    <EntryListPresenter
      entries={entries}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onDelete={deleteEntry}
    />
  );
}
```

### **5. Higher-Order Components (HOC)**

```typescript
// ✅ Cross-Cutting Concerns via HOC
function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = <ErrorFallback />
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
}

// Usage:
const ProtectedEntryList = withAuth(withErrorBoundary(EntryList));
```

---

## 📦 State Management

### **Zustand Store Pattern**

```typescript
// ✅ Feature-basierte Stores mit Zustand

// entries.store.ts
interface EntriesState {
  entries: Entry[];
  selectedId: string | null;
  filter: EntryFilter;
  
  // Actions
  setEntries: (entries: Entry[]) => void;
  selectEntry: (id: string | null) => void;
  setFilter: (filter: EntryFilter) => void;
  
  // Computed/Selectors
  filteredEntries: () => Entry[];
  selectedEntry: () => Entry | null;
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  selectedId: null,
  filter: { search: '', tags: [], group: null },
  
  setEntries: (entries) => set({ entries }),
  selectEntry: (id) => set({ selectedId: id }),
  setFilter: (filter) => set({ filter }),
  
  filteredEntries: () => {
    const { entries, filter } = get();
    return entries.filter(entry => {
      // Search
      if (filter.search && !entry.title.includes(filter.search)) {
        return false;
      }
      // Tags
      if (filter.tags.length && !filter.tags.some(tag => entry.tags.includes(tag))) {
        return false;
      }
      // Group
      if (filter.group && entry.groupId !== filter.group) {
        return false;
      }
      return true;
    });
  },
  
  selectedEntry: () => {
    const { entries, selectedId } = get();
    return entries.find(e => e.id === selectedId) || null;
  },
}));

// Mit Persistence
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      theme: 'system',
      autoLockTimeout: 300,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'vaultix-settings',
    }
  )
);
```

### **React Query Integration**

```typescript
// ✅ Server State mit React Query

// api/entries.ts
export function useEntriesQuery(databaseId: string) {
  return useQuery({
    queryKey: ['entries', databaseId],
    queryFn: () => fetchEntries(databaseId),
    staleTime: 1000 * 60 * 5, // 5 Minuten
  });
}

export function useEntryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; updates: Partial<Entry> }) =>
      updateEntry(data.id, data.updates),
    onSuccess: (updatedEntry) => {
      // Optimistic Update
      queryClient.setQueryData(
        ['entry', updatedEntry.id],
        updatedEntry
      );
      // Invalidate List
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });
}

// Component Usage
function EntryList() {
  const { data: entries, isLoading } = useEntriesQuery('db-123');
  const updateMutation = useEntryMutation();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {entries?.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          onUpdate={(updates) => updateMutation.mutate({ id: entry.id, updates })}
        />
      ))}
    </div>
  );
}
```

---

## 🎨 Tailwind CSS Patterns

### **Component Variants mit CVA (Class Variance Authority)**

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ 
  className, 
  variant, 
  size, 
  loading,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}

// Usage:
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" loading={isLoading}>Save</Button>
```

### **Responsive Design Utilities**

```typescript
// ✅ Mobile-First Approach
<div className="
  flex flex-col          /* Mobile: Stack vertikal */
  md:flex-row           /* Tablet+: Horizontal */
  gap-4                 /* 16px spacing */
  p-4                   /* 16px padding */
  md:p-6                /* Tablet: 24px */
  lg:p-8                /* Desktop: 32px */
">
  <aside className="
    w-full              /* Mobile: Full width */
    md:w-64             /* Tablet+: Fixed 256px */
    md:shrink-0         /* Don't shrink */
  ">
    <Navigation />
  </aside>
  
  <main className="
    flex-1              /* Take remaining space */
    min-w-0             /* Allow shrinking */
  ">
    <Content />
  </main>
</div>
```

### **Dark Mode mit Tailwind**

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--color-foreground) / <alpha-value>)',
          muted: 'rgb(var(--color-foreground-muted) / <alpha-value>)',
        },
      },
    },
  },
};

// globals.css
@layer base {
  :root {
    --color-background: 255 255 255;
    --color-background-secondary: 249 250 251;
    --color-foreground: 15 23 42;
    --color-foreground-muted: 148 163 184;
  }
  
  .dark {
    --color-background: 15 23 42;
    --color-background-secondary: 30 41 59;
    --color-foreground: 241 245 249;
    --color-foreground-muted: 148 163 184;
  }
}

// Component:
<div className="bg-background text-foreground">
  <p className="text-foreground-muted">Muted text</p>
</div>
```

---

## 🔐 Security Best Practices

### **1. Sichere Passwort-Handling**

```typescript
// ✅ Master Password nie im Memory speichern länger als nötig
class SecureString {
  private data: Uint8Array;
  
  constructor(value: string) {
    this.data = new TextEncoder().encode(value);
  }
  
  use<T>(fn: (value: string) => T): T {
    const value = new TextDecoder().decode(this.data);
    try {
      return fn(value);
    } finally {
      // Clear from memory
      value.split('').forEach((_, i) => value[i] = '\0');
    }
  }
  
  dispose() {
    // Overwrite with zeros
    this.data.fill(0);
  }
}

// Usage:
const masterPassword = new SecureString(userInput);
try {
  await masterPassword.use(async (password) => {
    await unlockDatabase(password);
  });
} finally {
  masterPassword.dispose();
}
```

### **2. Auto-Lock Mechanism**

```typescript
function useAutoLock() {
  const { autoLockTimeout } = useSettings();
  const { lockDatabase } = useDatabase();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lockDatabase();
      }, autoLockTimeout * 1000);
    };
    
    // Events die Timer zurücksetzen
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    resetTimer(); // Initial start
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [autoLockTimeout, lockDatabase]);
}
```

### **3. Clipboard Security**

```typescript
async function copyToClipboard(text: string, clearAfter: number = 30) {
  await navigator.clipboard.writeText(text);
  
  // Auto-clear nach X Sekunden
  setTimeout(async () => {
    const current = await navigator.clipboard.readText();
    if (current === text) {
      await navigator.clipboard.writeText('');
    }
  }, clearAfter * 1000);
  
  toast.success(`Copied to clipboard (clears in ${clearAfter}s)`);
}
```

---

## 🧪 Testing Strategy

### **Testing Pyramid**

```
              /\
             /  \
            / E2E \ (10% - Playwright)
           /______\
          /        \
         / Integration \ (20% - React Testing Library)
        /______________\
       /                \
      /   Unit Tests     \ (70% - Vitest)
     /____________________\
```

### **Unit Tests (Vitest)**

```typescript
// entry.test.ts
import { describe, it, expect } from 'vitest';
import { EntryBuilder } from './EntryBuilder';

describe('EntryBuilder', () => {
  it('should build entry with all fields', () => {
    const entry = new EntryBuilder()
      .setTitle('GitHub')
      .setUsername('max.mustermann')
      .setPassword('secret123')
      .addCustomField('2FA', 'TOTP_SECRET', true)
      .build();
    
    expect(entry.title).toBe('GitHub');
    expect(entry.username).toBe('max.mustermann');
    expect(entry.customFields).toHaveLength(1);
    expect(entry.customFields[0].protected).toBe(true);
  });
  
  it('should validate required fields', () => {
    expect(() => {
      new EntryBuilder().build();
    }).toThrow('Title is required');
  });
});
```

### **Integration Tests (React Testing Library)**

```typescript
// EntryList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntryList } from './EntryList';

describe('EntryList', () => {
  it('should display entries and allow selection', async () => {
    const mockEntries = [
      { id: '1', title: 'GitHub', username: 'user1' },
      { id: '2', title: 'Gmail', username: 'user2' },
    ];
    
    render(<EntryList entries={mockEntries} />);
    
    // Entries sind sichtbar
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Gmail')).toBeInTheDocument();
    
    // Klick auf Entry
    await userEvent.click(screen.getByText('GitHub'));
    
    // Preview öffnet sich
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
  });
});
```

### **E2E Tests (Playwright)**

```typescript
// e2e/unlock-database.spec.ts
import { test, expect } from '@playwright/test';

test('unlock database and view entry', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Upload database
  await page.setInputFiles('input[type="file"]', './test-data/test.kdbx');
  
  // Enter master password
  await page.fill('input[type="password"]', 'testpassword123');
  await page.click('button:has-text("Unlock")');
  
  // Wait for unlock
  await expect(page.locator('.entry-list')).toBeVisible();
  
  // Select entry
  await page.click('text=Test Entry');
  
  // Verify preview
  await expect(page.locator('.entry-preview')).toContainText('Test Entry');
  await expect(page.locator('.custom-fields')).toBeVisible();
});
```

---

## 📁 Projekt-Struktur (Electron + Python Backend)

```
vaultix/
├─ .flatpak-manifest.json
├─ org.vaultix.Vaultix.desktop
├─ org.vaultix.Vaultix.metainfo.xml
├─ org.vaultix.Vaultix.svg (Icon)
│
├─ frontend/                  # React App (Electron Renderer)
│  ├─ src/
│  │  ├─ app/                 # Application Layer
│  │  ├─ features/            # Feature Modules (siehe Architektur)
│  │  ├─ shared/              # Shared Resources
│  │  ├─ entities/            # Domain Models
│  │  └─ main.tsx
│  ├─ public/
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ tailwind.config.js
│
├─ electron/                  # Electron Main Process
│  ├─ main.ts                 # Electron entry point
│  ├─ preload.ts              # Preload script (IPC bridge)
│  ├─ ipc/                    # IPC handlers
│  │  ├─ database.ts
│  │  ├─ generator.ts
│  │  └─ audit.ts
│  └─ python-bridge.ts        # Python subprocess management
│
├─ backend/                   # Python Backend (FastAPI)
│  ├─ app/
│  │  ├─ main.py              # FastAPI app
│  │  ├─ config.py
│  │  └─ dependencies.py
│  ├─ api/                    # API Endpoints (siehe Architektur)
│  ├─ core/                   # Core Business Logic
│  ├─ models/                 # Pydantic Models
│  ├─ services/               # Business Services
│  ├─ utils/
│  ├─ requirements.txt
│  └─ pyproject.toml
│
├─ resources/                 # Resources für Build
│  ├─ icons/
│  ├─ wordlists/              # EFF Wordlist für Passphrase
│  └─ certificates/
│
├─ scripts/                   # Build Scripts
│  ├─ build-flatpak.sh
│  ├─ build-appimage.sh
│  └─ package-electron.sh
│
└─ docs/
   ├─ API.md
   ├─ ARCHITECTURE.md
   ├─ SECURITY.md
   └─ CONTRIBUTING.md
```

### **Electron Main Process (Python Bridge)**

```typescript
// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

let pythonProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

// Start Python Backend
function startPythonBackend() {
  const pythonPath = app.isPackaged
    ? path.join(process.resourcesPath, 'python', 'vaultix-backend')
    : path.join(__dirname, '..', 'backend', 'app', 'main.py');
  
  pythonProcess = spawn('python3', [pythonPath], {
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  });
  
  pythonProcess.stdout?.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });
  
  pythonProcess.stderr?.on('data', (data) => {
    console.error(`[Python Error] ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    console.log(`Python backend exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  
  // Load React app
  if (app.isPackaged) {
    mainWindow.loadFile('dist/index.html');
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
});

app.on('before-quit', () => {
  pythonProcess?.kill();
});
```

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// Expose safe IPC methods to renderer
contextBridge.exposeInMainWorld('api', {
  // Database operations
  openDatabase: (path: string, password: string) =>
    ipcRenderer.invoke('database:open', path, password),
  
  saveDatabase: (path: string) =>
    ipcRenderer.invoke('database:save', path),
  
  closeDatabase: () =>
    ipcRenderer.invoke('database:close'),
  
  // Generator operations
  generatePassword: (options: PasswordOptions) =>
    ipcRenderer.invoke('generator:password', options),
  
  generatePassphrase: (options: PassphraseOptions) =>
    ipcRenderer.invoke('generator:passphrase', options),
  
  generatePin: (options: PinOptions) =>
    ipcRenderer.invoke('generator:pin', options),
  
  // Security audit
  runSecurityAudit: () =>
    ipcRenderer.invoke('audit:run'),
  
  findDuplicates: () =>
    ipcRenderer.invoke('audit:duplicates'),
  
  checkPasswordStrength: (password: string) =>
    ipcRenderer.invoke('audit:strength', password),
});
```

```typescript
// electron/python-bridge.ts
import axios from 'axios';

const PYTHON_API_URL = 'http://localhost:8000';

export class PythonBridge {
  private client = axios.create({
    baseURL: PYTHON_API_URL,
    timeout: 30000,
  });
  
  // Database operations
  async openDatabase(path: string, password: string) {
    const response = await this.client.post('/api/database/open', {
      path,
      password,
    });
    return response.data;
  }
  
  // Generator operations
  async generatePassword(options: PasswordOptions) {
    const response = await this.client.post('/api/generator/password', options);
    return response.data;
  }
  
  async generatePassphrase(options: PassphraseOptions) {
    const response = await this.client.post('/api/generator/passphrase', options);
    return response.data;
  }
  
  // Security audit
  async runSecurityAudit() {
    const response = await this.client.get('/api/audit/full');
    return response.data;
  }
  
  async checkPasswordStrength(password: string) {
    const response = await this.client.post('/api/audit/strength', { password });
    return response.data;
  }
}
```

### **Python FastAPI Endpoint Examples**

```python
# backend/api/generator.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.generators.password import PasswordGenerator
from core.generators.passphrase import PassphraseGenerator
from core.generators.pin import PinGenerator

router = APIRouter(prefix="/api/generator", tags=["generator"])

class PasswordOptions(BaseModel):
    length: int = 16
    uppercase: bool = True
    lowercase: bool = True
    numbers: bool = True
    symbols: bool = True
    exclude_similar: bool = True
    strategy: str = "random"  # random, pronounceable

class PassphraseOptions(BaseModel):
    word_count: int = 6
    separator: str = "-"
    capitalize: bool = False
    include_number: bool = False
    strategy: str = "diceware"  # diceware, random_words

class PinOptions(BaseModel):
    length: int = 4
    exclude_sequential: bool = True

@router.post("/password")
async def generate_password(options: PasswordOptions):
    """Generate a password"""
    try:
        generator = PasswordGenerator()
        password = generator.generate(options.dict())
        strength = generator.estimate_strength(password)
        
        return {
            "password": password,
            "entropy": strength['entropy'],
            "strength": strength['level'],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/passphrase")
async def generate_passphrase(options: PassphraseOptions):
    """Generate a passphrase"""
    generator = PassphraseGenerator()
    passphrase = await generator.generate(options.dict())
    
    return {
        "passphrase": passphrase,
        "entropy": generator.calculate_entropy(options.word_count),
    }

@router.post("/pin")
async def generate_pin(options: PinOptions):
    """Generate a PIN"""
    generator = PinGenerator()
    pin = generator.generate(options.dict())
    
    return {
        "pin": pin,
        "entropy": generator.calculate_entropy(options.length),
    }
```

### **Flatpak Manifest (Electron + Python)**

```json
{
  "app-id": "org.vaultix.Vaultix",
  "runtime": "org.freedesktop.Platform",
  "runtime-version": "24.08",
  "sdk": "org.freedesktop.Sdk",
  "command": "vaultix",
  "finish-args": [
    "--socket=wayland",
    "--socket=fallback-x11",
    "--share=ipc",
    "--device=dri",
    "--filesystem=home:ro",
    "--filesystem=xdg-documents",
    "--share=network",
    "--env=ELECTRON_FORCE_IS_PACKAGED=1"
  ],
  "modules": [
    {
      "name": "python-dependencies",
      "buildsystem": "simple",
      "build-commands": [
        "pip3 install --no-index --find-links=file://${PWD} --prefix=${FLATPAK_DEST} pykeepass cryptography fastapi uvicorn zxcvbn aiohttp"
      ],
      "sources": [
        {
          "type": "file",
          "url": "https://files.pythonhosted.org/packages/...",
          "sha256": "..."
        }
      ]
    },
    {
      "name": "vaultix",
      "buildsystem": "simple",
      "build-commands": [
        "npm install --prefix frontend",
        "npm run build --prefix frontend",
        "npm run package",
        "install -Dm755 dist/vaultix /app/bin/vaultix",
        "install -Dm644 resources/icons/512x512.png /app/share/icons/hicolor/512x512/apps/org.vaultix.Vaultix.png",
        "install -Dm644 org.vaultix.Vaultix.desktop /app/share/applications/org.vaultix.Vaultix.desktop",
        "install -Dm644 org.vaultix.Vaultix.metainfo.xml /app/share/metainfo/org.vaultix.Vaultix.metainfo.xml",
        "cp -r backend /app/share/vaultix/backend",
        "cp -r resources /app/share/vaultix/resources"
      ],
      "sources": [
        {
          "type": "dir",
          "path": "."
        }
      ]
    }
  ]
}
```
    {
      "name": "vaultix",
      "buildsystem": "simple",
      "build-commands": [
        "npm install --prefix frontend",
        "npm run build --prefix frontend",
        "cargo build --release --manifest-path backend/Cargo.toml",
        "install -Dm755 backend/target/release/vaultix /app/bin/vaultix",
        "install -Dm644 org.vaultix.Vaultix.desktop /app/share/applications/org.vaultix.Vaultix.desktop",
        "install -Dm644 org.vaultix.Vaultix.metainfo.xml /app/share/metainfo/org.vaultix.Vaultix.metainfo.xml",
        "install -Dm644 org.vaultix.Vaultix.svg /app/share/icons/hicolor/scalable/apps/org.vaultix.Vaultix.svg"
      ],
      "sources": [
        {
          "type": "dir",
          "path": "."
        }
      ]
    }
  ]
}
```

---

## 🚀 Development Workflow

### **Lokale Entwicklung**

```bash
# Frontend (React + Vite)
cd frontend
npm install
npm run dev              # Läuft auf http://localhost:5173

# Backend (Rust - Tauri)
cd tauri
cargo tauri dev          # Startet Desktop App mit Hot Reload

# Backend (Python Alternative)
cd backend
poetry install
poetry run uvicorn main:app --reload
```

### **Build Commands**

```bash
# Development Build
npm run build:dev

# Production Build
npm run build:prod

# Flatpak Build
flatpak-builder --force-clean build-dir org.vaultix.Vaultix.json

# AppImage Build
npm run build:appimage

# Tauri Desktop
cargo tauri build
```

### **Code Quality Tools**

```json
// package.json
{
  "scripts": {
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.11",
    "vitest": "^1.3.0",
    "@vitest/ui": "^1.3.0",
    "@playwright/test": "^1.41.0"
  }
}
```

### **Pre-commit Hooks (Husky)**

```bash
# .husky/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test -- --run
```

---

## 📚 Dokumentation Requirements

### **Code Documentation**

```typescript
/**
 * Decrypts a KDBX database using the provided master password.
 * 
 * @param path - Absolute path to the .kdbx file
 * @param password - Master password (will be securely cleared after use)
 * @param keyFile - Optional key file path for composite keys
 * @returns Decrypted database instance
 * @throws {InvalidPasswordError} If password is incorrect
 * @throws {CorruptedDatabaseError} If database is corrupted
 * @throws {UnsupportedVersionError} If KDBX version is not supported
 * 
 * @example
 * ```typescript
 * const db = await unlockDatabase(
 *   '/home/user/passwords.kdbx',
 *   'mySecurePassword123'
 * );
 * ```
 */
export async function unlockDatabase(
  path: string,
  password: string,
  keyFile?: string
): Promise<Database> {
  // Implementation
}
```

### **README Structure**

```markdown
# Vaultix

> Modern, secure, and user-friendly password manager

## Features
- ✅ Full KDBX 4.x support
- ✅ All custom properties visible in preview
- ✅ Native attachment preview (PDF, images, documents)
- ✅ Cross-platform (Linux, Windows, macOS via Flatpak/AppImage)
- ✅ Offline-first with optional cloud sync
- ✅ Modern, intuitive UI

## Installation

### Flatpak
```bash
flatpak install flathub org.vaultix.Vaultix
```

### AppImage
Download from [Releases](https://github.com/vaultix/vaultix/releases)

## Development

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## License
GPLv3
```

---

## 🎯 Roadmap & Milestones

### **Phase 1: MVP (3-4 Monate)**
- [ ] KDBX 4.x Parser/Writer (Rust)
- [ ] Basic UI (Entry List, Preview, Editor)
- [ ] Master Password Unlock
- [ ] Custom Properties Display
- [ ] Basic Search
- [ ] Flatpak Build

### **Phase 2: Enhanced Features (2-3 Monate)**
- [ ] Attachment Preview (PDF, Images)
- [ ] Password Generator
- [ ] Tags & Favorites
- [ ] Advanced Search (Fuzzy, Filters)
- [ ] Auto-Lock
- [ ] Clipboard Security

### **Phase 3: Advanced (2-3 Monate)**
- [ ] Browser Extension
- [ ] Cloud Sync (Dropbox, Google Drive)
- [ ] TOTP Generator
- [ ] Biometric Unlock
- [ ] Audit Log
- [ ] Dark Mode

### **Phase 4: Polish (1-2 Monate)**
- [ ] i18n (DE, EN, FR, ES)
- [ ] Performance Optimization
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Comprehensive Tests
- [ ] Documentation

---

## 💡 Zusätzliche Considerations

### **Performance**
- Virtuelle Liste für 10.000+ Einträge
- Web Workers für Crypto-Operationen
- IndexedDB für lokales Caching
- Lazy Loading für Attachments
- Optimistic UI Updates

### **Accessibility**
- ARIA Labels
- Keyboard Navigation (Vim-like optional)
- Screen Reader Support
- High Contrast Mode
- Focus Management

### **i18n**
- react-i18next
- Sprachen: DE, EN, FR, ES, IT
- RTL Support für Arabisch/Hebräisch
- Datum/Zeit Lokalisierung

### **Analytics & Telemetry**
- Opt-in Crash Reports (Sentry)
- **Keine** Usage Analytics
- Privacy-First Approach

---

## 🔗 Externe Ressourcen

- **KDBX Format:** https://keepass.info/help/kb/kdbx_4.html
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **Tauri:** https://tauri.app
- **Flatpak:** https://docs.flatpak.org

---

## 📝 Zusammenfassung

**Vaultix** kombiniert moderne Web-Technologien (React, Tailwind) mit performantem Backend (Rust) zu einem benutzerfreundlichen Password Manager, der die Schwächen bestehender Lösungen adressiert. Durch strikte Beachtung von Design Patterns, Clean Architecture und Security Best Practices entsteht eine professionelle, wartbare und erweiterbare Codebase.

**Nächster Schritt:** MVP Prototype mit Fokus auf KDBX Parser + Basic UI!

---

**Erstellt am:** 2026-02-07
**Version:** 1.0
**Autor:** Vaultix Development Team

---

## 🔐 Security Audit & Password Health

### **Password Strength Analysis (zxcvbn)**

```python
# backend/core/security/strength_analyzer.py
from zxcvbn import zxcvbn
from typing import Dict, List
from enum import Enum

class PasswordStrength(str, Enum):
    VERY_WEAK = "very_weak"      # Score 0-1
    WEAK = "weak"                 # Score 2
    MEDIUM = "medium"             # Score 3
    STRONG = "strong"             # Score 4
    VERY_STRONG = "very_strong"   # Score 5+ (custom)

class StrengthAnalyzer:
    """Analyzes password strength using zxcvbn"""
    
    def analyze(self, password: str, user_inputs: List[str] = None) -> Dict:
        """
        Analyze password strength
        
        Args:
            password: Password to analyze
            user_inputs: List of user-specific words (username, email, etc.)
        
        Returns:
            Dict with score, feedback, and crack time estimates
        """
        result = zxcvbn(password, user_inputs=user_inputs or [])
        
        return {
            'score': result['score'],  # 0-4
            'strength': self._get_strength_level(result['score']),
            'entropy': self._calculate_entropy(password),
            'crack_time': {
                'online_throttling': result['crack_times_display']['online_throttling_100_per_hour'],
                'online_no_throttling': result['crack_times_display']['online_no_throttling_10_per_second'],
                'offline_slow': result['crack_times_display']['offline_slow_hashing_1e4_per_second'],
                'offline_fast': result['crack_times_display']['offline_fast_hashing_1e10_per_second'],
            },
            'feedback': {
                'warning': result['feedback'].get('warning', ''),
                'suggestions': result['feedback'].get('suggestions', []),
            },
            'pattern_analysis': result['sequence'],
        }
    
    def _get_strength_level(self, score: int) -> PasswordStrength:
        """Map zxcvbn score to strength level"""
        if score == 0:
            return PasswordStrength.VERY_WEAK
        elif score == 1:
            return PasswordStrength.WEAK
        elif score == 2:
            return PasswordStrength.MEDIUM
        elif score == 3:
            return PasswordStrength.STRONG
        else:
            return PasswordStrength.VERY_STRONG
    
    def _calculate_entropy(self, password: str) -> float:
        """Calculate Shannon entropy"""
        import math
        from collections import Counter
        
        if not password:
            return 0.0
        
        counts = Counter(password)
        length = len(password)
        
        entropy = -sum(
            (count / length) * math.log2(count / length)
            for count in counts.values()
        )
        
        return entropy * length
```

### **Duplicate Password Detection**

```python
# backend/core/security/duplicate_detector.py
from collections import defaultdict
from typing import List, Dict, Set
from hashlib import sha256

class DuplicateDetector:
    """Detects duplicate and reused passwords"""
    
    def find_duplicates(self, entries: List[Dict]) -> Dict[str, List[str]]:
        """
        Find entries with identical passwords
        
        Returns:
            Dict mapping password hash to list of entry IDs
        """
        password_map = defaultdict(list)
        
        for entry in entries:
            if password := entry.get('password'):
                # Hash password for comparison (don't store plaintext)
                pwd_hash = sha256(password.encode()).hexdigest()
                password_map[pwd_hash].append({
                    'id': entry['id'],
                    'title': entry['title'],
                    'group': entry.get('group', 'Unknown'),
                })
        
        # Return only duplicates (> 1 entry)
        return {
            pwd_hash: entries
            for pwd_hash, entries in password_map.items()
            if len(entries) > 1
        }
    
    def find_reused(self, entries: List[Dict], threshold: int = 2) -> List[Dict]:
        """
        Find passwords used more than threshold times
        
        Args:
            entries: List of entry dicts
            threshold: Minimum reuse count to flag
        
        Returns:
            List of reused password groups
        """
        duplicates = self.find_duplicates(entries)
        
        return [
            {
                'count': len(entry_list),
                'entries': entry_list,
                'severity': self._get_severity(len(entry_list)),
            }
            for entry_list in duplicates.values()
            if len(entry_list) >= threshold
        ]
    
    def _get_severity(self, count: int) -> str:
        """Determine severity based on reuse count"""
        if count >= 5:
            return 'critical'
        elif count >= 3:
            return 'high'
        else:
            return 'medium'
```

### **Have I Been Pwned Integration**

```python
# backend/core/security/breach_checker.py
import asyncio
import aiohttp
from hashlib import sha1
from typing import Optional

class BreachChecker:
    """Check passwords against Have I Been Pwned database"""
    
    API_URL = "https://api.pwnedpasswords.com/range/{}"
    
    async def check_password(self, password: str) -> Optional[int]:
        """
        Check if password has been breached
        
        Args:
            password: Password to check
        
        Returns:
            Number of times password appears in breaches, or None if not found
        """
        # Hash password with SHA-1 (HIBP uses SHA-1)
        pwd_hash = sha1(password.encode('utf-8')).hexdigest().upper()
        
        # k-Anonymity: Send only first 5 chars
        prefix = pwd_hash[:5]
        suffix = pwd_hash[5:]
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.API_URL.format(prefix)) as response:
                if response.status != 200:
                    raise Exception(f"HIBP API error: {response.status}")
                
                # Parse response (format: SUFFIX:COUNT)
                text = await response.text()
                for line in text.splitlines():
                    hash_suffix, count = line.split(':')
                    if hash_suffix == suffix:
                        return int(count)
        
        return None  # Not found in breaches
    
    async def batch_check(self, passwords: List[str]) -> Dict[str, Optional[int]]:
        """Check multiple passwords concurrently"""
        tasks = [self.check_password(pwd) for pwd in passwords]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            pwd: result if not isinstance(result, Exception) else None
            for pwd, result in zip(passwords, results)
        }
```

### **Security Audit Service**

```python
# backend/services/audit_service.py
from typing import Dict, List
from datetime import datetime, timedelta

class SecurityAuditService:
    """Comprehensive security audit for database"""
    
    def __init__(
        self,
        strength_analyzer: StrengthAnalyzer,
        duplicate_detector: DuplicateDetector,
        breach_checker: BreachChecker,
    ):
        self.strength = strength_analyzer
        self.duplicates = duplicate_detector
        self.breach = breach_checker
    
    async def run_full_audit(self, entries: List[Dict]) -> Dict:
        """Run comprehensive security audit"""
        
        # 1. Analyze password strengths
        weak_passwords = []
        for entry in entries:
            if password := entry.get('password'):
                analysis = self.strength.analyze(password)
                if analysis['score'] < 3:  # Below "Strong"
                    weak_passwords.append({
                        'entry': entry,
                        'analysis': analysis,
                    })
        
        # 2. Find duplicates
        duplicates = self.duplicates.find_reused(entries, threshold=2)
        
        # 3. Check for breached passwords
        passwords_to_check = [e['password'] for e in entries if e.get('password')]
        breach_results = await self.breach.batch_check(passwords_to_check)
        breached = [
            {'entry': e, 'breach_count': breach_results.get(e['password'])}
            for e in entries
            if e.get('password') and breach_results.get(e['password'])
        ]
        
        # 4. Find expired entries
        expired = self._find_expired(entries)
        
        # 5. Calculate overall security score
        total_entries = len(entries)
        score = self._calculate_security_score(
            total=total_entries,
            weak=len(weak_passwords),
            duplicates=sum(d['count'] for d in duplicates),
            breached=len(breached),
            expired=len(expired),
        )
        
        return {
            'timestamp': datetime.now().isoformat(),
            'total_entries': total_entries,
            'security_score': score,
            'issues': {
                'weak_passwords': {
                    'count': len(weak_passwords),
                    'entries': weak_passwords,
                },
                'duplicates': {
                    'count': len(duplicates),
                    'groups': duplicates,
                },
                'breached': {
                    'count': len(breached),
                    'entries': breached,
                },
                'expired': {
                    'count': len(expired),
                    'entries': expired,
                },
            },
            'recommendations': self._generate_recommendations(
                weak_passwords, duplicates, breached, expired
            ),
        }
    
    def _find_expired(self, entries: List[Dict], days: int = 90) -> List[Dict]:
        """Find entries not modified in X days"""
        cutoff = datetime.now() - timedelta(days=days)
        
        return [
            e for e in entries
            if e.get('modified') and datetime.fromisoformat(e['modified']) < cutoff
        ]
    
    def _calculate_security_score(
        self,
        total: int,
        weak: int,
        duplicates: int,
        breached: int,
        expired: int,
    ) -> int:
        """Calculate security score 0-100"""
        if total == 0:
            return 100
        
        # Weighted penalty system
        penalties = {
            'weak': weak * 2,
            'duplicates': duplicates * 3,
            'breached': breached * 5,
            'expired': expired * 1,
        }
        
        total_penalty = sum(penalties.values())
        max_penalty = total * 5  # Maximum possible penalty
        
        score = max(0, 100 - int((total_penalty / max_penalty) * 100))
        return score
    
    def _generate_recommendations(
        self,
        weak: List,
        duplicates: List,
        breached: List,
        expired: List,
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if weak:
            recommendations.append(
                f"🔴 Update {len(weak)} weak passwords to stronger alternatives"
            )
        
        if duplicates:
            total_dupes = sum(d['count'] for d in duplicates)
            recommendations.append(
                f"🟠 Change {total_dupes} duplicate passwords to unique ones"
            )
        
        if breached:
            recommendations.append(
                f"🔴 URGENT: {len(breached)} passwords found in data breaches - change immediately"
            )
        
        if expired:
            recommendations.append(
                f"🟡 Review and update {len(expired)} entries not modified in 90+ days"
            )
        
        if not recommendations:
            recommendations.append("✅ No critical security issues found")
        
        return recommendations
```

### **Frontend Integration**

```typescript
// features/security-audit/components/PasswordHealthDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

export function PasswordHealthDashboard() {
  const { data: audit, isLoading } = useQuery({
    queryKey: ['security-audit'],
    queryFn: () => api.runSecurityAudit(),
  });
  
  if (isLoading) return <Skeleton />;
  
  const score = audit?.security_score || 0;
  const scoreColor = score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';
  
  return (
    <div className="space-y-6">
      {/* Security Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sicherheits-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-6xl font-bold" style={{ color: scoreColor }}>
              {score}
            </div>
            <div className="flex-1">
              <Progress value={score} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2">
                {score >= 80 ? 'Ausgezeichnet' : score >= 60 ? 'Gut' : 'Verbesserung nötig'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Issues Overview */}
      <div className="grid grid-cols-2 gap-4">
        <IssueCard
          title="Schwache Passwörter"
          count={audit?.issues.weak_passwords.count}
          severity="high"
          icon="⚠️"
        />
        <IssueCard
          title="Duplikate"
          count={audit?.issues.duplicates.count}
          severity="medium"
          icon="♻️"
        />
        <IssueCard
          title="In Leaks gefunden"
          count={audit?.issues.breached.count}
          severity="critical"
          icon="🔴"
        />
        <IssueCard
          title="Abgelaufen"
          count={audit?.issues.expired.count}
          severity="low"
          icon="⏰"
        />
      </div>
      
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Empfehlungen</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {audit?.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```


---

## 📝 Zusammenfassung der Tech-Stack-Entscheidungen

### **Backend: Python 3.12+** ✅

**Warum Python statt Rust:**
- ✅ **Schnellere Entwicklung**: 3-5x schneller zum MVP
- ✅ **Ausgereiftes Ökosystem**: pykeepass, cryptography, FastAPI battle-tested
- ✅ **Einfachere Wartung**: Weniger Compiler-Kämpfe, intuitivere Debugging
- ✅ **Perfekt für MVP**: Features > Performance in früher Phase
- ✅ **Spätere Optimierung möglich**: Kritische Teile können in Rust portiert werden

**Python Libraries:**
```python
pykeepass          # KDBX 4.x parsing & writing
cryptography       # AES, Argon2, ChaCha20
fastapi            # REST API für Electron IPC
uvicorn            # ASGI server
pydantic           # Data validation
whoosh             # Full-text search
zxcvbn-python      # Password strength analysis
aiohttp            # Async HTTP (HaveIBeenPwned API)
pillow             # Image processing
pypdf              # PDF handling
```

### **Desktop: Electron** ✅

**Warum Electron statt Tauri:**
- ✅ **Python-Integration**: Einfacher Python-Subprocess via child_process
- ✅ **Größeres Ökosystem**: Mehr Libraries, Tutorials, Community
- ✅ **Weniger experimentell**: Tauri ist noch relativ neu
- ✅ **Einfacheres IPC**: Kein Rust-Kompilieren für Commands nötig

### **Frontend: React + TypeScript + Tailwind** ✅

Bleibt unverändert - moderne, bewährte Stack.

### **Architektur: Clean Architecture + Feature-Sliced Design** ✅

**Prinzipien:**
- ✅ **Microservice-artige Modularität**: Jedes Feature ist eigenständig
- ✅ **Wartbarkeit**: Klare Trennung von Concerns
- ✅ **Erweiterbarkeit**: Neue Features einfach hinzufügbar
- ✅ **Testbarkeit**: Jede Schicht einzeln testbar

### **Neue Features (über KeePassXC hinaus):** ✅

**Menüleiste mit Tools:**
1. 🎲 **Passwort-Generator** (Random, Pronounceable)
2. 📝 **Passphrase-Generator** (Diceware, Random Words)
3. 🔢 **PIN-Generator** (Numeric, Sequential-safe)
4. 💊 **Passwort-Gesundheit** (zxcvbn strength analysis)
5. 🔍 **Duplikate finden** (SHA-256 basiert)
6. ⚠️ **Schwache Passwörter** (Score < 3)
7. ♻️ **Wiederverwendete Passwörter** (mit Severity)
8. 🔴 **Breach-Check** (HaveIBeenPwned Integration)
9. 📊 **Sicherheits-Audit** (Comprehensive Dashboard)
10. 📈 **Statistiken & Berichte**

**Menu-Struktur:**
- Datei: Öffnen, Speichern, Exportieren, Importieren, Master-PW ändern
- Bearbeiten: Entry CRUD, Kopieren, Suchen
- Ansicht: Layout-Anpassungen, Sortierung
- Tools: Alle Generator & Audit-Tools
- Hilfe: Docs, Shortcuts, Updates

---

## 🎯 Nächste Schritte (Development Roadmap)

### **Phase 1: MVP Foundation (Wochen 1-4)**
```
✅ Woche 1-2: Backend
   - pykeepass Integration
   - FastAPI Setup
   - Basic KDBX open/save
   - Crypto wrapper

✅ Woche 3-4: Frontend
   - Electron Setup mit Python Bridge
   - React UI Grundgerüst
   - Entry List (Virtual)
   - Entry Preview mit Custom Fields
```

### **Phase 2: Core Features (Wochen 5-8)**
```
✅ Woche 5-6: Generators
   - Password/Passphrase/PIN Generatoren
   - Strength Meter UI
   - Generator Settings

✅ Woche 7-8: Security Audit
   - zxcvbn Integration
   - Duplicate Detection
   - HIBP Integration
   - Audit Dashboard
```

### **Phase 3: Polish (Wochen 9-12)**
```
✅ Woche 9: Attachment Preview
   - PDF Viewer (pypdf)
   - Image Viewer (Pillow)
   - File Upload/Download

✅ Woche 10: Advanced Features
   - Search & Filters
   - Tags & Favorites
   - Auto-Lock
   - Clipboard Security

✅ Woche 11-12: Testing & Packaging
   - Unit Tests (Vitest + Pytest)
   - Integration Tests
   - E2E Tests (Playwright)
   - Flatpak Build
   - AppImage Build
```

---

## 📚 Ressourcen & Links

**KDBX Format:**
- Spec: https://keepass.info/help/kb/kdbx_4.html
- pykeepass Docs: https://github.com/libkeepass/pykeepass

**Python Libraries:**
- FastAPI: https://fastapi.tiangolo.com
- cryptography: https://cryptography.io
- zxcvbn: https://github.com/dropbox/zxcvbn

**Frontend:**
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- Zustand: https://zustand-demo.pmnd.rs

**Desktop:**
- Electron: https://www.electronjs.org
- Flatpak: https://docs.flatpak.org

**Wordlists:**
- EFF Wordlist: https://www.eff.org/dice
- Diceware: https://theworld.com/~reinhold/diceware.html

---

**Erstellt am:** 2026-02-07  
**Version:** 2.0 (Python Backend Edition)  
**Autor:** Vaultix Development Team

