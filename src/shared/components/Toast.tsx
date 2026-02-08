import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { id, type, message, duration }] }))
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
}))

export function toast(type: ToastType, message: string) {
  useToastStore.getState().addToast(type, message)
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
}

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [exiting, setExiting] = useState(false)
  const Icon = iconMap[t.type]

  useEffect(() => {
    if (!t.duration) return
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onRemove, 200)
    }, t.duration)
    return () => clearTimeout(timer)
  }, [t.duration, onRemove])

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg transition-all duration-200',
        colorMap[t.type],
        exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <p className="text-sm flex-1">{t.message}</p>
      <button
        className="h-4 w-4 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        onClick={() => { setExiting(true); setTimeout(onRemove, 200) }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
