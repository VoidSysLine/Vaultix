import { useEffect, useRef, useCallback } from 'react'
import { useSettingsStore } from '@/features/settings/store/settingsStore'

export function useAutoLock(onLock: () => void) {
  const autoLockTimeout = useSettingsStore((s) => s.autoLockTimeout)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (autoLockTimeout > 0) {
      timerRef.current = setTimeout(onLock, autoLockTimeout * 1000)
    }
  }, [autoLockTimeout, onLock])

  useEffect(() => {
    if (autoLockTimeout <= 0) return

    const events = ['mousedown', 'keydown', 'mousemove', 'scroll', 'touchstart']

    const handleActivity = () => resetTimer()

    events.forEach((event) => document.addEventListener(event, handleActivity, { passive: true }))
    resetTimer()

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleActivity))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [autoLockTimeout, resetTimer])
}
