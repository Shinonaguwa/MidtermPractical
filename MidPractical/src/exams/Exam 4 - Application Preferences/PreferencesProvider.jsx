import { useCallback, useMemo, useState } from 'react';
import { FONT_SIZES, PreferencesContext } from './PreferencesContext.js';

export default function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSizeState] = useState(16);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const setFontSize = useCallback((size) => {
    if (FONT_SIZES.includes(size)) {
      setFontSizeState(size);
    }
  }, []);

  const value = useMemo(
    () => ({ theme, fontSize, toggleTheme, setFontSize }),
    [theme, fontSize, toggleTheme, setFontSize]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
