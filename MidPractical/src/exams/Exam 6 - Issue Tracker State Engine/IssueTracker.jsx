import { useState } from 'react';
import DebugNotes from '../../components/DebugNotes.jsx';
import { initialState, isValidIssueState, issueReducer } from './issueReducer.js';
import { usePersistentReducer } from './usePersistentReducer.js';

const STORAGE_KEY = 'exam6.issue-tracker.v1';

const FILTER_LABELS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Done' }
];

const DEBUG_CASES = [
  {
    title: 'direct state mutation',
    broken: `case 'TOGGLE_ISSUE': {
  const issue = state.issues.find((item) => item.id === action.payload.id);
  issue.done = !issue.done;          // mutates the existing issue object
  return state;                      // same reference, React sees no change
}`,
    fixed: `case 'TOGGLE_ISSUE':
  return {
    ...state,
    issues: state.issues.map((issue) =>
      issue.id === action.payload.id ? { ...issue, done: !issue.done } : issue
    )
  };`,
    explanation:
      'React compares the previous and next state by reference. Mutating the old object and returning it means no change is detected, so the screen may not update, and memoization and Strict Mode double-invocation produce wrong results. The repair returns a new state object with a new issues array and a new object only for the issue that changed. The reducer tests freeze the sample state, so any mutation throws.'
  },
  {
    title: 'action shape mismatch (payload)',
    broken: `// reducer reads action.payload.title
dispatch({ type: 'ADD_ISSUE', title });   // sends action.title`,
    fixed: `dispatch({ type: 'ADD_ISSUE', payload: { title } });`,
    explanation:
      'The reducer reads action.payload.title, but the faulty dispatch put the value in action.title. The payload was undefined, so the title lookup failed. The repair makes dispatch match the documented action shape: every action that carries data sends it inside payload.'
  },
  {
    title: 'default branch returns undefined',
    broken: `default:
  return;          // state becomes undefined`,
    fixed: `default:
  return state;`,
    explanation:
      'A reducer must always return the next state. Returning undefined replaces the whole state with undefined, and the next render crashes when it reads state.issues. Returning the existing state for unknown actions leaves everything unchanged.'
  }
];

export default function IssueTracker() {
  const [state, dispatch] = usePersistentReducer(
    issueReducer,
    initialState,
    STORAGE_KEY,
    isValidIssueState
  );
  const [title, setTitle] = useState('');

  const { issues, filter } = state;

  const counts = {
    all: issues.length,
    open: issues.filter((issue) => !issue.done).length,
    done: issues.filter((issue) => issue.done).length
  };

  const visibleIssues =
    filter === 'all' ? issues : issues.filter((issue) => (filter === 'done' ? issue.done : !issue.done));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: 'ADD_ISSUE', payload: { title } });
    setTitle('');
  };

  return (
    <div>
      <h2>Exam 6: Issue Tracker State Engine</h2>
      <p className="hint">
        Hook focus: useReducer and a custom Hook (usePersistentReducer). Issues are saved in
        localStorage and restored after a refresh.
      </p>

      <form onSubmit={handleSubmit} className="controls">
        <div className="field">
          <label htmlFor="issue-title">New issue title</label>
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <button type="submit" disabled={!title.trim()} style={{ marginBottom: 14 }}>
          Add issue
        </button>
      </form>

      <div className="btn-row filter-row" role="group" aria-label="Issue filter">
        {FILTER_LABELS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className="secondary"
            aria-pressed={filter === value}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: value } })}
          >
            {label} ({counts[value]})
          </button>
        ))}
        <button
          type="button"
          className="secondary"
          disabled={counts.done === 0}
          onClick={() => dispatch({ type: 'CLEAR_DONE' })}
        >
          Clear done
        </button>
      </div>

      {visibleIssues.length === 0 ? (
        <p>No {filter === 'all' ? '' : `${filter} `}issues to show.</p>
      ) : (
        <ul className="issue-list">
          {visibleIssues.map((issue) => (
            <li key={issue.id} className={issue.done ? 'done' : ''}>
              <input
                type="checkbox"
                id={`issue-${issue.id}`}
                checked={issue.done}
                onChange={() => dispatch({ type: 'TOGGLE_ISSUE', payload: { id: issue.id } })}
              />
              <label htmlFor={`issue-${issue.id}`} className="issue-title">
                #{issue.id} {issue.title}
              </label>
              <button
                type="button"
                className="secondary"
                aria-label={`Delete issue ${issue.id}: ${issue.title}`}
                onClick={() => dispatch({ type: 'DELETE_ISSUE', payload: { id: issue.id } })}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <DebugNotes cases={DEBUG_CASES} />
    </div>
  );
}
