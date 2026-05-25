import type { HTMLAttributes, ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Surface({ children, className = '', style, ...rest }: Props) {
  const { theme } = useTheme()
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}