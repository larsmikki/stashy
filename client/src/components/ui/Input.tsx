import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  highlighted?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { invalid, highlighted, className = '', style, ...rest },
  ref,
) {
  const { theme } = useTheme()
  const borderColor = invalid ? '#dc2626' : highlighted ? theme.accent : theme.border
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none placeholder:opacity-40 ${className}`}
      style={{
        background: theme.surface2,
        border: `1px solid ${borderColor}`,
        color: theme.text,
        ...style,
      }}
      {...rest}
    />
  )
})
