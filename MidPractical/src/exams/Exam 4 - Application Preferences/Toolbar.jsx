import { usePreferences } from './usePreferences.js';

export default function Toolbar() {
  const { theme, fontSize, toggleTheme } = usePreferences();

  return (
    <section aria-label="Toolbar">
      <h3>Toolbar</h3>
      <p>
        Current theme: <strong>{theme}</strong> &middot; Font size: <strong>{fontSize}px</strong>
      </p>
      <button type="button" className="secondary" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </section>
  );
}
