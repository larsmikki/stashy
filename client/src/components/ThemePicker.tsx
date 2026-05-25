import { useTheme, THEMES } from '@/contexts/ThemeContext';

export default function ThemePicker() {
  const { theme, setThemeByName } = useTheme();

  return (
    <div className="grid grid-cols-5 gap-2">
      {THEMES.map(t => {
        const isActive = t.name === theme.name;

        return (
          <button
            key={t.name}
            onClick={() => setThemeByName(t.name)}
            className="w-full aspect-[4/3] rounded-lg p-2 flex flex-col gap-1 border-2 transition-opacity hover:opacity-90"
            style={{
              borderColor: isActive ? theme.accent : 'transparent',
              background: isActive ? `${theme.accent}10` : 'transparent',
              boxShadow: isActive ? `0 0 0 3px ${theme.accent}15` : 'none',
            }}
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden flex">
              {t.previewColors.map((c, i) => (
                <div key={i} className="flex-1" style={{ background: c }} />
              ))}
              <div className="absolute bottom-0 left-0 right-0 text-center px-1 py-1 bg-black/40">
                <span className="text-[10px] font-medium text-white">{t.name}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
