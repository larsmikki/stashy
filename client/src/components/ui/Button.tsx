import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  fullWidth?: boolean
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'h-[30px] px-3 text-xs rounded-lg',
  md: 'h-9 px-4 text-sm rounded-lg',
  lg: 'h-10 px-5 text-sm rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'secondary', size = 'md', leadingIcon, trailingIcon, fullWidth, className = '', style, children, ...rest },
  ref,
) {
  const { theme } = useTheme()

  const baseStyle: React.CSSProperties = (() => {
    switch (variant) {
      case 'primary':
        return { background: 'var(--brand-gradient)', color: '#fff', boxShadow: size === 'lg' ? `0 4px 14px ${theme.accent}40` : undefined }
      case 'danger':
        return { background: theme.surface2, color: '#dc2626', border: `1px solid ${theme.border}` }
      case 'ghost':
        return { background: 'transparent', color: theme.text2 }
      case 'secondary':
      default:
        return { background: theme.surface2, color: theme.text, border: `1px solid ${theme.border}` }
    }
  })()

  const hoverClass = variant === 'primary' ? 'hover:opacity-90' : 'hover:opacity-80'

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold transition-opacity ${hoverClass} disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_CLASS[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ ...baseStyle, ...style }}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
})
