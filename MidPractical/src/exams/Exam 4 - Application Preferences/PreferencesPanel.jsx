import { FONT_SIZES } from './PreferencesContext.js';
import { usePreferences } from './usePreferences.js';

export default function PreferencesPanel() {
  const { theme, fontSize, toggleTheme, setFontSize } = usePreferences();

  return (
    <section aria-label="Preferences panel">
      <h3>Preferences</h3>

      <div className="btn-row" role="group" aria-label="Theme">
        <button
          type="button"
          className="secondary"
          aria-pressed={theme === 'dark'}
          onClick={toggleTheme}
        >
          Dark theme: {theme === 'dark' ? 'on' : 'off'}
        </button>
      </div>

      <div className="btn-row" role="group" aria-label="Font size">
        {FONT_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className="secondary"
            aria-pressed={fontSize === size}
            onClick={() => setFontSize(size)}
          >
            {size}px
          </button>
        ))}
      </div>
    </section>
  );
}
