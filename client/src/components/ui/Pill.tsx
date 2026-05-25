import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  dot?: string
  children: ReactNode
}

export function Pill({ active, dot, children, className = '', style, ...rest }: Props) {
  const { theme } = useTheme()
  const activeStyle: React.CSSProperties = active
    ? { background: theme.accent, color: '#fff', boxShadow: `0 2px 8px ${theme.accent}50` }
    : { background: theme.surface, color: theme.text2, border: `1px solid ${theme.border}` }

  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${className}`}
      style={{ ...activeStyle, ...style }}
      {...rest}
    >
      {dot && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: active ? '#fff' : dot }}
        />
      )}
      {children}
    </button>
  )
}