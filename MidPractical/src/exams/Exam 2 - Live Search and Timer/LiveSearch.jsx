import { useEffect, useState } from 'react';
import DebugNotes from '../../components/DebugNotes.jsx';

const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' }
];

const SEARCH_DELAY_MS = 400;

function filterUsers(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return USERS;
  return USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(needle) || user.role.toLowerCase().includes(needle)
  );
}

function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p role="timer">Session time: {seconds} s</p>;
}

const DEBUG_CASES = [
  {
    title: 'effect depends on the state it updates and runs repeatedly',
    broken: `useEffect(() => {
  setResults(filterUsers(query));
}, [query, results]); // results is updated by this effect`,
    fixed: `useEffect(() => {
  const id = setTimeout(() => {
    setResults(filterUsers(query));
    setIsSearching(false);
  }, SEARCH_DELAY_MS);
  return () => clearTimeout(id);
}, [query]); // only the real input`,
    explanation:
      'Every setResults call produces a new array, which changes the results dependency, which re-runs the effect, which sets results again, and so on. The fix is to list only the values the effect reads from the component scope as inputs. The effect reads query, so query is the only dependency. results is only written, never read, so it does not belong in the array.'
  },
  {
    title: 'timer callback is stuck at one',
    broken: `useEffect(() => {
  const id = setInterval(() => {
    setSeconds(seconds + 1);   // seconds is always 0 here
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    fixed: `useEffect(() => {
  const id = setInterval(() => {
    setSeconds((current) => current + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    explanation:
      'The effect ran once, so the interval callback closed over the seconds value from the first render (0). Each tick set the state to 0 + 1, which is always 1. A functional update asks React for the latest value, so the callback no longer depends on a captured snapshot and the dependency array can stay empty.'
  },
  {
    title: 'explain the cleanup functions',
    explanation:
      'Delayed search: each query change schedules a setTimeout. React runs the previous effect cleanup, clearTimeout, before the next effect. A timeout from an earlier keystroke is therefore cancelled and can never overwrite newer results, so fast typing cannot show an outdated result. Interval: the cleanup calls clearInterval when the SessionTimer unmounts (and before Strict Mode re-runs the effect in development). Without it the interval would keep ticking and calling setSeconds after the component is gone, and each remount would add another interval, doubling the speed.'
  }
];

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const [isSearching, setIsSearching] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setResults(filterUsers(query));
      setIsSearching(false);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const resultCount = results.length;
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${resultCount} ${resultCount === 1 ? 'result' : 'results'} | Live Search`;
    return () => {
      document.title = previousTitle;
    };
  }, [resultCount]);

  return (
    <div>
      <h2>Exam 2: Live Search and Timer</h2>
      <p className="hint">Hook focus: useEffect with useState</p>

      <div className="field">
        <label htmlFor="user-search">Search users by name or role</label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try &quot;dev&quot; or &quot;Ana&quot;"
        />
      </div>

      <p role="status" aria-live="polite">
        {isSearching ? 'Searching...' : `${resultCount} ${resultCount === 1 ? 'result' : 'results'} shown`}
      </p>

      <ul className="user-list">
        {results.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> &mdash; {user.role}
          </li>
        ))}
      </ul>
      {!isSearching && results.length === 0 && <p>No users match your search.</p>}

      <hr />
      {showTimer && <SessionTimer />}
      <button
        type="button"
        className="secondary"
        onClick={() => setShowTimer((visible) => !visible)}
      >
        {showTimer ? 'Unmount timer' : 'Mount timer'}
      </button>
      <p className="hint">
        Unmounting runs the interval cleanup. Mounting again starts a fresh timer at 0 with a
        single interval.
      </p>

      <DebugNotes cases={DEBUG_CASES} />
    </div>
  );
}
