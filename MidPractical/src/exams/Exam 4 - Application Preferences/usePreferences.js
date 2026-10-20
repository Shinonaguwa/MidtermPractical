import { useContext } from 'react';
import { PreferencesContext } from './PreferencesContext.js';

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error(
      'usePreferences must be used inside a <PreferencesProvider>. Wrap the component tree with the provider.'
    );
  }

  return context;
}
