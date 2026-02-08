import { useState, useCallback, useEffect } from 'react'
import { RefreshCw, Copy, Check, Shield } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useClipboard } from '@/shared/hooks/useClipboard'
import { cn } from '@/shared/utils/cn'
import {
  generatePassword,
  generatePassphrase,
  generatePin,
  estimateEntropy,
  getStrengthLevel,
  DEFAULT_PASSWORD_OPTIONS,
  DEFAULT_PASSPHRASE_OPTIONS,
  DEFAULT_PIN_OPTIONS,
  type PasswordOptions,
  type PassphraseOptions,
  type PinOptions,
} from '@/features/generator/services/passwordService'

type GeneratorMode = 'password' | 'passphrase' | 'pin'

export function PasswordGenerator() {
  const [mode, setMode] = useState<GeneratorMode>('password')
  const [result, setResult] = useState('')
  const [passwordOpts, setPasswordOpts] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS)
  const [passphraseOpts, setPassphraseOpts] = useState<PassphraseOptions>(DEFAULT_PASSPHRASE_OPTIONS)
  const [pinOpts, setPinOpts] = useState<PinOptions>(DEFAULT_PIN_OPTIONS)
  const { copy, copied } = useClipboard()

  const generate = useCallback(() => {
    switch (mode) {
      case 'password':
        setResult(generatePassword(passwordOpts))
        break
      case 'passphrase':
        setResult(generatePassphrase(passphraseOpts))
        break
      case 'pin':
        setResult(generatePin(pinOpts))
        break
    }
  }, [mode, passwordOpts, passphraseOpts, pinOpts])

  useEffect(() => {
    generate()
  }, [generate])

  const currentOptions = mode === 'password' ? passwordOpts : mode === 'passphrase' ? passphraseOpts : pinOpts
  const entropy = estimateEntropy(mode, currentOptions)
  const strength = getStrengthLevel(entropy)

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Mode Selector */}
      <div className="flex rounded-lg bg-[rgb(var(--color-background-secondary))] p-1">
        {(['password', 'passphrase', 'pin'] as const).map((m) => (
          <button
            key={m}
            className={cn(
              'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              mode === m
                ? 'bg-[rgb(var(--color-background))] shadow-sm'
                : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
            )}
            onClick={() => setMode(m)}
          >
            {m === 'password' ? 'Passwort' : m === 'passphrase' ? 'Passphrase' : 'PIN'}
          </button>
        ))}
      </div>

      {/* Generated Result */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={result}
              readOnly
              className="font-mono text-base pr-20"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copy(result)}>
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={generate}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Strength Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" style={{ color: strength.color }} />
              <span style={{ color: strength.color }}>{strength.label}</span>
            </div>
            <span className="text-[rgb(var(--color-foreground-muted))]">
              {Math.round(entropy)} Bits Entropie
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[rgb(var(--color-background-tertiary))]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (entropy / 128) * 100)}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {mode === 'password' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label>Länge</label>
                <span className="font-mono text-[rgb(var(--color-foreground-muted))]">{passwordOpts.length}</span>
              </div>
              <input
                type="range"
                min={4}
                max={128}
                value={passwordOpts.length}
                onChange={(e) => setPasswordOpts({ ...passwordOpts, length: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>
            {([
              ['uppercase', 'Großbuchstaben (A-Z)'],
              ['lowercase', 'Kleinbuchstaben (a-z)'],
              ['numbers', 'Zahlen (0-9)'],
              ['symbols', 'Sonderzeichen (!@#$...)'],
              ['excludeSimilar', 'Ähnliche ausschließen (l, 1, I, O, 0)'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between text-sm cursor-pointer">
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={passwordOpts[key]}
                  onChange={(e) => setPasswordOpts({ ...passwordOpts, [key]: e.target.checked })}
                  className="accent-[var(--color-primary-500)] h-4 w-4"
                />
              </label>
            ))}
          </>
        )}

        {mode === 'passphrase' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label>Anzahl Wörter</label>
                <span className="font-mono text-[rgb(var(--color-foreground-muted))]">{passphraseOpts.wordCount}</span>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                value={passphraseOpts.wordCount}
                onChange={(e) => setPassphraseOpts({ ...passphraseOpts, wordCount: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label>Trennzeichen</label>
              <Input
                value={passphraseOpts.separator}
                onChange={(e) => setPassphraseOpts({ ...passphraseOpts, separator: e.target.value })}
                className="w-20 h-8 text-center font-mono"
              />
            </div>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Großschreibung</span>
              <input
                type="checkbox"
                checked={passphraseOpts.capitalize}
                onChange={(e) => setPassphraseOpts({ ...passphraseOpts, capitalize: e.target.checked })}
                className="accent-[var(--color-primary-500)] h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Zahl anhängen</span>
              <input
                type="checkbox"
                checked={passphraseOpts.includeNumber}
                onChange={(e) => setPassphraseOpts({ ...passphraseOpts, includeNumber: e.target.checked })}
                className="accent-[var(--color-primary-500)] h-4 w-4"
              />
            </label>
          </>
        )}

        {mode === 'pin' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label>Länge</label>
                <span className="font-mono text-[rgb(var(--color-foreground-muted))]">{pinOpts.length}</span>
              </div>
              <input
                type="range"
                min={4}
                max={12}
                value={pinOpts.length}
                onChange={(e) => setPinOpts({ ...pinOpts, length: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Sequenzen ausschließen (1234, 1111...)</span>
              <input
                type="checkbox"
                checked={pinOpts.excludeSequential}
                onChange={(e) => setPinOpts({ ...pinOpts, excludeSequential: e.target.checked })}
                className="accent-[var(--color-primary-500)] h-4 w-4"
              />
            </label>
          </>
        )}
      </div>

      {/* Generate Button */}
      <Button className="w-full" onClick={generate}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Neu generieren
      </Button>
    </div>
  )
}
