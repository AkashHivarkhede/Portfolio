import { useEffect, useState, useCallback } from 'react';

export type ThemeName = 'default' | 'red' | 'light';

export const themes: { name: ThemeName; label: string }[] = [
  { name: 'default', label: 'Blue' },
  { name: 'red', label: 'Red' },
  { name: 'light', label: 'Light' },
];

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>('default');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName | null;
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
  }, []);

  return { theme, setTheme };
}
