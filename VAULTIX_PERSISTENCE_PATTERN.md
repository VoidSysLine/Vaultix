# 💾 Datenbank-Persistenz Pattern

## ⚠️ KRITISCH: Auto-Save vs Manual-Save

### **Strategie: Manual Save mit Auto-Save Option**

```typescript
// features/database/store/databaseStore.ts
interface DatabaseState {
  database: Database | null;
  isDirty: boolean;              // Hat ungespeicherte Änderungen
  autoSave: boolean;             // Einstellung: Auto-speichern
  autoSaveInterval: number;      // Sekunden bis Auto-Save
  lastSaved: Date | null;
  
  // Actions
  markDirty: () => void;
  save: () => Promise<void>;
  enableAutoSave: (enabled: boolean) => void;
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  database: null,
  isDirty: false,
  autoSave: true,              // Default: AN
  autoSaveInterval: 30,        // Alle 30 Sekunden
  lastSaved: null,
  
  markDirty: () => {
    set({ isDirty: true });
    
    // Trigger Auto-Save wenn aktiviert
    const { autoSave } = get();
    if (autoSave) {
      get().scheduleSave();
    }
  },
  
  scheduleSave: debounce(() => {
    get().save();
  }, get().autoSaveInterval * 1000),
  
  save: async () => {
    const { database } = get();
    if (!database) return;
    
    try {
      // Python Backend aufrufen
      await window.api.saveDatabase(database.path);
      
      set({ 
        isDirty: false, 
        lastSaved: new Date() 
      });
      
      toast.success('Datenbank gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern');
      throw error;
    }
  },
}));
```

### **Bei JEDER Datenbank-Änderung: markDirty() aufrufen**

```typescript
// features/entries/hooks/useEntryEditor.ts
export function useEntryEditor(entryId: string) {
  const { database, markDirty, save } = useDatabaseStore();
  const queryClient = useQueryClient();
  
  const updateEntry = useMutation({
    mutationFn: async (updates: Partial<Entry>) => {
      // 1. Backend aufrufen
      const updated = await window.api.updateEntry(entryId, updates);
      
      // 2. SOFORT als dirty markieren
      markDirty();
      
      return updated;
    },
    onSuccess: (updated) => {
      // 3. Cache aktualisieren
      queryClient.setQueryData(['entry', entryId], updated);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      
      // 4. Auto-Save triggert automatisch (wenn enabled)
      // ODER User muss manuell Ctrl+S drücken
    },
  });
  
  return { updateEntry };
}
```

### **Backend: Änderungen in .kdbx schreiben**

```python
# backend/api/entries.py
from fastapi import APIRouter, HTTPException
from pykeepass import PyKeePass

router = APIRouter(prefix="/api/entries")

# Globale Datenbank-Instanz (oder Dependency Injection)
current_db: PyKeePass | None = None

@router.put("/{entry_id}")
async def update_entry(entry_id: str, updates: EntryUpdate):
    """Update entry und schreibe in .kdbx Datei"""
    if not current_db:
        raise HTTPException(status_code=400, detail="No database open")
    
    # 1. Entry finden
    entry = current_db.find_entries(uuid=entry_id, first=True)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # 2. Änderungen anwenden
    if updates.title:
        entry.title = updates.title
    if updates.username:
        entry.username = updates.username
    if updates.password:
        entry.password = updates.password
    if updates.url:
        entry.url = updates.url
    if updates.notes:
        entry.notes = updates.notes
    
    # Custom Fields
    if updates.custom_fields:
        for field_name, field_value in updates.custom_fields.items():
            entry.set_custom_property(field_name, field_value)
    
    # 3. SOFORT in Datei schreiben
    current_db.save()
    
    # 4. Updated Entry zurückgeben
    return {
        'id': str(entry.uuid),
        'title': entry.title,
        'username': entry.username,
        'password': entry.password,
        'url': entry.url,
        'notes': entry.notes,
        'custom_fields': entry.custom_properties,
        'modified': entry.mtime.isoformat(),
    }

@router.post("/save")
async def force_save():
    """Manuelles Speichern (Ctrl+S)"""
    if not current_db:
        raise HTTPException(status_code=400, detail="No database open")
    
    current_db.save()
    return {"success": True, "timestamp": datetime.now().isoformat()}
```

### **UI: Dirty-State Indicator**

```typescript
// features/database/components/DatabaseStatus.tsx
export function DatabaseStatus() {
  const { isDirty, lastSaved, save } = useDatabaseStore();
  
  // Keyboard Shortcut: Ctrl+S
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    save();
  });
  
  return (
    <div className="flex items-center gap-2 text-sm">
      {isDirty && (
        <span className="flex items-center gap-1 text-yellow-600">
          <CircleAlert className="h-4 w-4" />
          Ungespeicherte Änderungen
        </span>
      )}
      
      {lastSaved && (
        <span className="text-muted-foreground">
          Zuletzt gespeichert: {formatRelativeTime(lastSaved)}
        </span>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        onClick={save}
        disabled={!isDirty}
        className="ml-2"
      >
        <Save className="h-4 w-4 mr-1" />
        Speichern
      </Button>
    </div>
  );
}
```

### **Settings: Auto-Save Toggle**

```typescript
// features/settings/components/SecuritySettings.tsx
export function SecuritySettings() {
  const { autoSave, autoSaveInterval, enableAutoSave } = useDatabaseStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatisches Speichern</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Auto-Save aktivieren</Label>
          <Switch
            checked={autoSave}
            onCheckedChange={enableAutoSave}
          />
        </div>
        
        {autoSave && (
          <div>
            <Label>Speicher-Intervall (Sekunden)</Label>
            <Input
              type="number"
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
              min={10}
              max={300}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Änderungen werden alle {autoSaveInterval} Sekunden gespeichert
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### **Window Close: Warnung bei ungespeicherten Änderungen**

```typescript
// electron/main.ts
mainWindow.on('close', (e) => {
  const isDirty = /* get from store */;
  
  if (isDirty) {
    e.preventDefault();
    
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'warning',
      buttons: ['Speichern', 'Verwerfen', 'Abbrechen'],
      title: 'Ungespeicherte Änderungen',
      message: 'Die Datenbank hat ungespeicherte Änderungen.',
      detail: 'Möchten Sie vor dem Schließen speichern?',
    });
    
    if (choice === 0) {
      // Speichern
      await window.api.saveDatabase();
      mainWindow.destroy();
    } else if (choice === 1) {
      // Verwerfen
      mainWindow.destroy();
    }
    // choice === 2: Abbrechen - nichts tun
  }
});
```

---

## ✅ **Zusammenfassung: Persistenz-Garantie**

### **Jede Änderung durchläuft:**

```
User ändert Entry
    ↓
Frontend: updateEntry.mutate()
    ↓
Backend: current_db.save() ← WICHTIG! SOFORT schreiben!
    ↓
.kdbx Datei aktualisiert ← Persistent auf Disk
    ↓
Frontend: markDirty() + Auto-Save Timer (optional)
    ↓
Status-Bar: "Gespeichert um XX:XX"
```

### **Garantien:**

✅ **Sofortiges Schreiben**: Jede Änderung wird SOFORT in `.kdbx` geschrieben
✅ **Auto-Save Option**: User kann wählen zwischen Auto oder Manuell
✅ **Dirty-State Tracking**: UI zeigt ungespeicherte Änderungen
✅ **Keyboard Shortcut**: Ctrl+S zum manuellen Speichern
✅ **Close-Warning**: Warnung beim Schließen mit ungespeicherten Daten
✅ **Crash-Safety**: Bei Crash sind Änderungen bereits auf Disk (weil sofort geschrieben)

---

**Erstellt am:** 2026-02-07  
**Wichtigkeit:** 🔴 KRITISCH für Datenverlust-Prävention
