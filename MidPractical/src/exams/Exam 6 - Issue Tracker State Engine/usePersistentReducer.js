import { useEffect, useReducer } from 'react';

function loadState(storageKey, fallback, validate) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) return fallback;

    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function usePersistentReducer(reducer, initialState, storageKey, validate = () => true) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) =>
    loadState(storageKey, initial, validate)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
    }
  }, [state, storageKey]);

  return [state, dispatch];
}
