import { Copy, Check } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useClipboard } from '@/shared/hooks/useClipboard'
import { cn } from '@/shared/utils/cn'

interface CopyableFieldProps {
  value: string
  label?: string
  className?: string
  mono?: boolean
}

export function CopyableField({ value, label, className, mono }: CopyableFieldProps) {
  const { copy, copied } = useClipboard()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && (
        <span className="text-sm text-[rgb(var(--color-foreground-muted))] min-w-[80px]">
          {label}
        </span>
      )}
      <span className={cn('flex-1 text-sm select-all', mono && 'font-mono')}>
        {value}
      </span>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copy(value)}>
        {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}
