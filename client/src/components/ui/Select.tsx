import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', style, children, ...rest }, ref) {
    const { theme } = useTheme()
    return (
      <select
        ref={ref}
        className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${className}`}
        style={{
          background: theme.surface2,
          border: `1px solid ${theme.border}`,
          color: theme.text,
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
    )
  },
)