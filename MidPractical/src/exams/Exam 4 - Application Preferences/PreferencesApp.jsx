import DebugNotes from '../../components/DebugNotes.jsx';
import Dashboard from './Dashboard.jsx';
import PreferencesProvider from './PreferencesProvider.jsx';

const DEBUG_CASES = [
  {
    title: 'consumer receives only the default value (no provider)',
    broken: `// Context default is used because nothing provides a value
function App() {
  return <Dashboard />;   // no <PreferencesProvider>
}`,
    fixed: `function App() {
  return (
    <PreferencesProvider>
      <Dashboard />
    </PreferencesProvider>
  );
}`,
    explanation:
      'useContext returns the value of the nearest matching provider above the component. With no provider above it, React returns the default passed to createContext. Here that default is null, so usePreferences detects the missing provider and throws a clear error instead of silently using wrong data. Wrapping the tree in PreferencesProvider supplies the real value.'
  },
  {
    title: 'provider and consumer use two separate context objects',
    broken: `// Provider.jsx
const PreferencesContext = createContext(null);
// usePreferences.js
const PreferencesContext = createContext(null);   // a different object`,
    fixed: `// PreferencesContext.js (the only createContext call)
export const PreferencesContext = createContext(null);

// PreferencesProvider.jsx and usePreferences.js
import { PreferencesContext } from './PreferencesContext.js';`,
    explanation:
      'React matches a consumer to a provider by object identity, not by name. Two createContext calls make two unrelated contexts, so the consumer never sees the provider value. Creating the context once in its own module and importing that same export everywhere fixes it.'
  },
  {
    title: 'why context removes intermediate preference props',
    explanation:
      'With props, every component between the owner of the state and the consumer must accept and pass along the values, even if it never uses them. With context, the state lives in PreferencesProvider and any descendant can call usePreferences to read it directly, skipping the levels between. Dashboard, Toolbar, PreferencesPanel and ArticlePreview therefore take no preference props, and the provider rerenders consumers when its value changes.'
  }
];

export default function PreferencesApp() {
  return (
    <div>
      <h2>Exam 4: Application Preferences</h2>
      <p className="hint">Hook focus: useContext with useState</p>

      <PreferencesProvider>
        <Dashboard />
      </PreferencesProvider>

      <DebugNotes cases={DEBUG_CASES} />
    </div>
  );
}
