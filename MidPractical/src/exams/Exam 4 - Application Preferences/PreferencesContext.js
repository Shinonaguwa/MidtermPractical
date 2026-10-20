import { createContext } from 'react';

export const PreferencesContext = createContext(null);
PreferencesContext.displayName = 'PreferencesContext';

export const FONT_SIZES = [14, 16, 18];
export const THEMES = ['light', 'dark'];
