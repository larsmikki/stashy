import {
  useCallback, useEffect, useState,
  type ReactNode,
} from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { ToastContext, type ToastEntry, type ToastType } from './ToastContext'

const DEFAULT_DURATION_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastStack({
  toasts, onRemove,
}: { toasts: ToastEntry[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({
  toast, onRemove,
}: { toast: ToastEntry; onRemove: (id: string) => void }) {
  const { theme } = useTheme()

  useEffect(() => {
    const tid = setTimeout(() => onRemove(toast.id), DEFAULT_DURATION_MS)
    return () => clearTimeout(tid)
  }, [toast.id, onRemove])

  const typeColor =
    toast.type === 'success' ? '#16a34a' :
    toast.type === 'error'   ? '#dc2626' :
    theme.accent

  const ariaRole = toast.type === 'error' ? 'alert' : 'status'
  const ariaLive = toast.type === 'error' ? 'assertive' : 'polite'

  return (
    <div
      role={ariaRole}
      aria-live={ariaLive}
      className="toast-slide-in flex items-start gap-3 px-4 py-3 rounded-xl max-w-sm w-full pointer-events-auto"
      style={{
        backgroundColor: theme.surface,
        backgroundImage: `linear-gradient(${typeColor}15, ${typeColor}15)`,
        border: `1px solid ${typeColor}40`,
        boxShadow: `0 10px 24px rgba(0,0,0,0.15), 0 2px 4px ${typeColor}20`,
        color: theme.text,
      }}
    >
      <ToastIcon type={toast.type} color={typeColor} />
      <p className="flex-1 text-sm font-medium leading-snug" style={{ color: theme.text }}>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 p-0.5 hover:opacity-70"
        style={{ color: theme.text2 }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" clipRule="evenodd"/>
        </svg>
      </button>
    </div>
  )
}

function ToastIcon({ type, color }: { type: ToastType; color: string }) {
  if (type === 'success') {
    return (
      <svg className="w-5 h-5 shrink-0 mt-px" viewBox="0 0 20 20" fill={color} aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd"/>
      </svg>
    )
  }
  if (type === 'error') {
    return (
      <svg className="w-5 h-5 shrink-0 mt-px" viewBox="0 0 20 20" fill={color} aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.707 7.293a1 1 0 0 0-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 1 0 1.414 1.414L10 11.414l1.293 1.293a1 1 0 0 0 1.414-1.414L11.414 10l1.293-1.293a1 1 0 0 0-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 shrink-0 mt-px" viewBox="0 0 20 20" fill={color} aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9z" clipRule="evenodd"/>
    </svg>
  )
}
