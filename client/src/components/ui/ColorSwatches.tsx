import { useTheme } from '@/contexts/ThemeContext'

export const PRESET_COLORS = [
  '#e11d48', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#64748b',
]

interface Props {
  value: string
  onChange: (color: string) => void
  size?: number
}

export function ColorSwatches({ value, onChange, size = 20 }: Props) {
  const { theme } = useTheme()
  return (
    <div className="flex gap-1.5 flex-wrap">
      {PRESET_COLORS.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="rounded-full transition-transform hover:scale-110"
          style={{
            width: size,
            height: size,
            background: c,
            outline: value === c ? `2px solid ${theme.text}` : 'none',
            outlineOffset: 2,
          }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  )
}