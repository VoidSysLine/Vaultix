import { Shield, Settings, Lock, Moon, Sun } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SearchBar } from '@/features/search/components/SearchBar'
import { useSettingsStore } from '@/features/settings/store/settingsStore'

export function Header() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('system')
    else setTheme('dark')
  }

  return (
    <header className="h-[60px] bg-[rgb(var(--color-background))] border-b border-[rgb(var(--color-border))] flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[var(--color-primary-600)] text-white">
          <Shield className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Vaultix</span>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Lock className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
