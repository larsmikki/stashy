import { useTheme } from '@/contexts/ThemeContext'
import { PRESET_COLORS } from './presetColors'

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
