import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { STORAGE_KEY, THEMES, ThemeContext, type ThemeDefinition } from '@/contexts/ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeDefinition>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return THEMES.find(t => t.name === 'Default') || THEMES[0];
    if (stored === 'dark') return THEMES.find(t => t.name === 'Dark') || THEMES[0];
    if (stored === 'light') return THEMES[0];
    if (stored === 'Monochrome') return THEMES.find(t => t.name === 'Mono') || THEMES[0];
    if (stored === 'Earth') return THEMES.find(t => t.name === 'Mono') || THEMES[0];
    const found = THEMES.find(t => t.name === stored);
    return found || THEMES[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme.name);

    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-surface2', theme.surface2);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text2', theme.text2);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-gradient', theme.gradient);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(prev => {
      if (prev.mode === 'dark') return THEMES.find(t => t.name === 'Default') || THEMES[0];
      return THEMES.find(t => t.name === 'Dark') || THEMES[0];
    });
  }, []);

  const setThemeByName = useCallback((name: string) => {
    const found = THEMES.find(t => t.name === name);
    if (found) setTheme(found);
  }, []);

  return (
    <ThemeContext.Provider value={{ dark: theme.mode === 'dark', theme, toggle, setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
}
