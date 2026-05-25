import { useTheme } from '@/contexts/ThemeContext'

export function Spinner({ size = 40 }: { size?: number }) {
  const { theme } = useTheme()
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="rounded-full border-2 border-t-transparent animate-spin"
        style={{
          width: size,
          height: size,
          borderColor: `${theme.accent} transparent ${theme.accent} ${theme.accent}`,
        }}
      />
    </div>
  )
}