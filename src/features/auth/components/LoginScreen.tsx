import { useState } from 'react'
import { Shield, FolderOpen, Plus, Eye, EyeOff, Key, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'
import { databaseApi } from '@/shared/utils/api'

interface LoginScreenProps {
  onDatabaseOpened: (info: {
    name: string
    path: string
    entry_count: number
    group_count: number
  }) => void
}

export function LoginScreen({ onDatabaseOpened }: LoginScreenProps) {
  const [mode, setMode] = useState<'open' | 'create'>('open')
  const [filePath, setFilePath] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dbName, setDbName] = useState('Meine Passwörter')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectFile = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.openFileDialog({
        title: mode === 'open' ? 'Datenbank öffnen' : undefined,
        filters: [{ name: 'KeePass Datenbank', extensions: ['kdbx'] }],
      })
      if (path) setFilePath(path)
    } else {
      // Web mode: use file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.kdbx'
      input.onchange = () => {
        if (input.files?.[0]) {
          setFilePath(input.files[0].name)
        }
      }
      input.click()
    }
  }

  const handleSelectSaveLocation = async () => {
    if (window.electronAPI) {
      const path = await window.electronAPI.saveFileDialog({
        title: 'Neue Datenbank erstellen',
        filters: [{ name: 'KeePass Datenbank', extensions: ['kdbx'] }],
        defaultPath: `${dbName}.kdbx`,
      })
      if (path) setFilePath(path)
    }
  }

  const handleOpen = async () => {
    if (!filePath || !password) {
      setError('Bitte Datei und Passwort angeben')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await databaseApi.open(filePath, password)
      onDatabaseOpened(result.database)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!filePath || !password) {
      setError('Bitte Speicherort und Passwort angeben')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await databaseApi.create(filePath, password, dbName)
      onDatabaseOpened(result.database)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-950)] via-[#0f172a] to-[#020617]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--color-primary-600)] text-white mb-4 shadow-lg shadow-[var(--color-primary-600)]/30">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vaultix</h1>
          <p className="text-sm text-slate-400 mt-1">Next-Gen Password Manager</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-slate-900/50 p-1 mb-6">
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                mode === 'open'
                  ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
              onClick={() => { setMode('open'); setError(null) }}
            >
              <FolderOpen className="h-4 w-4" />
              Öffnen
            </button>
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                mode === 'create'
                  ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
              onClick={() => { setMode('create'); setError(null) }}
            >
              <Plus className="h-4 w-4" />
              Neu erstellen
            </button>
          </div>

          <div className="space-y-4">
            {/* Database Name (create mode only) */}
            {mode === 'create' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Datenbankname</label>
                <Input
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="Meine Passwörter"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {/* File Path */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                {mode === 'open' ? 'Datenbank-Datei' : 'Speicherort'}
              </label>
              <div className="flex gap-2">
                <Input
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder={mode === 'open' ? '/pfad/zur/datenbank.kdbx' : '/pfad/neue-datenbank.kdbx'}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <Button
                  variant="outline"
                  className="shrink-0 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={mode === 'open' ? handleSelectFile : handleSelectSaveLocation}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Master Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Master-Passwort</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Master-Passwort eingeben"
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && mode === 'open') handleOpen()
                  }}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (create mode only) */}
            {mode === 'create' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Passwort bestätigen</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort wiederholen"
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate()
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white"
              onClick={mode === 'open' ? handleOpen : handleCreate}
              loading={loading}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'open' ? 'Öffne...' : 'Erstelle...'}
                </>
              ) : (
                mode === 'open' ? 'Datenbank öffnen' : 'Datenbank erstellen'
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          KDBX 4.x kompatibel &middot; AES-256 / ChaCha20 &middot; Argon2
        </p>
      </div>
    </div>
  )
}
