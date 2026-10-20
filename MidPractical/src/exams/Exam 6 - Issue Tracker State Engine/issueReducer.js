export const FILTERS = ['all', 'open', 'done'];

export const initialState = {
  issues: [],
  filter: 'all',
  nextId: 1
};

export function issueReducer(state, action) {
  switch (action.type) {
    case 'ADD_ISSUE': {
      const title = typeof action.payload?.title === 'string' ? action.payload.title.trim() : '';
      if (!title) return state;

      return {
        ...state,
        issues: [...state.issues, { id: state.nextId, title, done: false }],
        nextId: state.nextId + 1
      };
    }

    case 'TOGGLE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === action.payload.id ? { ...issue, done: !issue.done } : issue
        )
      };

    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter((issue) => issue.id !== action.payload.id)
      };

    case 'SET_FILTER':
      if (!FILTERS.includes(action.payload.filter)) return state;
      return { ...state, filter: action.payload.filter };

    case 'CLEAR_DONE':
      return {
        ...state,
        issues: state.issues.filter((issue) => !issue.done)
      };

    default:
      return state;
  }
}

export function isValidIssueState(value) {
  if (!value || typeof value !== 'object') return false;
  if (!Array.isArray(value.issues)) return false;
  if (!FILTERS.includes(value.filter)) return false;
  if (!Number.isInteger(value.nextId)) return false;

  return value.issues.every(
    (issue) =>
      issue &&
      Number.isInteger(issue.id) &&
      typeof issue.title === 'string' &&
      typeof issue.done === 'boolean' &&
      issue.id < value.nextId
  );
}
