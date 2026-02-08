import { X, Shield, Heart } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface AboutDialogProps {
  onClose: () => void
}

export function AboutDialog({ onClose }: AboutDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-[rgb(var(--color-background))] rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 absolute top-3 right-3"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--color-primary-600)] text-white mb-4 shadow-lg">
          <Shield className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight">Vaultix</h2>
        <p className="text-sm text-[rgb(var(--color-foreground-muted))] mt-1">
          Next-Gen Password Manager
        </p>

        <div className="mt-4 text-xs text-[rgb(var(--color-foreground-muted))] space-y-1">
          <p>Version 0.1.0</p>
          <p>KDBX 4.x kompatibel</p>
          <p>AES-256 / ChaCha20 / Argon2</p>
        </div>

        <div className="mt-6 pt-4 border-t border-[rgb(var(--color-border))]">
          <p className="text-xs text-[rgb(var(--color-foreground-muted))] flex items-center justify-center gap-1">
            Gebaut mit <Heart className="h-3 w-3 text-red-500" /> und React + Python
          </p>
        </div>

        <Button variant="outline" className="mt-4" onClick={onClose}>
          Schließen
        </Button>
      </div>
    </div>
  )
}
