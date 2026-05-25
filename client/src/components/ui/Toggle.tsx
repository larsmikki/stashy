import type { ButtonHTMLAttributes } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, onChange, className = '', disabled, ...rest }: Props) {
  const { theme } = useTheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        background: checked ? theme.accent : theme.surface2,
        border: `1px solid ${checked ? theme.accent : theme.border}`,
        transition: 'background 200ms, border-color 200ms',
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow"
        style={{
          left: checked ? 20 : 2,
          transition: 'left 200ms',
        }}
      />
    </button>
  )
}
