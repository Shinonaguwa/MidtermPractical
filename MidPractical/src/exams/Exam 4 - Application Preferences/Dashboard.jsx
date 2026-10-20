import ArticlePreview from './ArticlePreview.jsx';
import PreferencesPanel from './PreferencesPanel.jsx';
import Toolbar from './Toolbar.jsx';
import { usePreferences } from './usePreferences.js';

export default function Dashboard() {
  const { theme } = usePreferences();

  return (
    <div className={`dashboard dashboard--${theme}`} data-theme={theme}>
      <h3 style={{ marginTop: 0 }}>Dashboard ({theme} theme)</h3>
      <Toolbar />
      <PreferencesPanel />
      <ArticlePreview />
    </div>
  );
}
