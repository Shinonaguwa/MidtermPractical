import { useState } from 'react';
import DebugNotes from '../../components/DebugNotes.jsx';

const INITIAL_COUNT = 0;
const INITIAL_TARGET = 5;
const MIN_TARGET = 1;
const MAX_TARGET = 99;

function getStatus(count, target) {
  if (count >= target) return 'Target reached';
  if (count === 0) return 'Not started';
  return 'In progress';
}

const DEBUG_CASES = [
  {
    title: 'plus two only increased the count by one',
    broken: `const addTwo = () => {
  setCount(count + 1);
  setCount(count + 1);
};`,
    fixed: `const addTwo = () => {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
};`,
    explanation:
      'Every render gets its own snapshot of state. During one render, count is a fixed value (for example 0), so count + 1 is 1 in both calls. React receives "set the count to 1" twice and the final result is 1. Functional updates are queued instead: the first updater receives 0 and returns 1, and React passes that result into the second updater, which returns 2. The handler never reads the stale captured value.'
  }
];

export default function TaskCounter() {
  const [count, setCount] = useState(INITIAL_COUNT);
  const [target, setTarget] = useState(INITIAL_TARGET);

  const status = getStatus(count, target);
  const targetReached = count >= target;

  const increment = () => {
    if (targetReached) return;
    setCount((current) => current + 1);
  };

  const decrement = () => {
    setCount((current) => Math.max(0, current - 1));
  };

  const reset = () => {
    setCount(0);
  };

  const addTwo = () => {
    if (targetReached) return;
    setCount((current) => current + 1);
    setCount((current) => current + 1);
  };

  const decreaseTarget = () => {
    setTarget((current) => Math.max(MIN_TARGET, current - 1));
  };

  const increaseTarget = () => {
    setTarget((current) => Math.min(MAX_TARGET, current + 1));
  };

  return (
    <div>
      <h2>Exam 1: Smart Task Counter</h2>
      <p className="hint">Hook focus: useState</p>

      <p className="stat">
        Completed tasks: <strong data-testid="count">{count}</strong> of target{' '}
        <strong data-testid="target">{target}</strong>
      </p>
      <progress
        value={Math.min(count, target)}
        max={target}
        aria-label="Progress toward target"
      />
      <p role="status">
        Status:{' '}
        <span className={targetReached ? 'status reached' : 'status'}>{status}</span>
      </p>

      <div className="btn-row" role="group" aria-label="Count controls">
        <button type="button" onClick={increment} disabled={targetReached}>
          Increment
        </button>
        <button type="button" onClick={addTwo} disabled={targetReached}>
          Plus two
        </button>
        <button type="button" onClick={decrement} disabled={count === 0}>
          Decrement
        </button>
        <button type="button" className="secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="btn-row" role="group" aria-label="Target controls">
        <button
          type="button"
          className="secondary"
          onClick={decreaseTarget}
          disabled={target <= MIN_TARGET}
        >
          Target &minus;
        </button>
        <button
          type="button"
          className="secondary"
          onClick={increaseTarget}
          disabled={target >= MAX_TARGET}
        >
          Target +
        </button>
      </div>

      <div className="btn-row" role="group" aria-label="Validation shortcuts">
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setTarget(5);
            setCount(0);
          }}
        >
          Case: target 5, count 0
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setTarget(5);
            setCount(4);
          }}
        >
          Case: target 5, count 4
        </button>
      </div>
      <p className="hint">
        At count 4 with target 5, Plus two adds exactly two (count 6). The target is then
        reached and Increment and Plus two are disabled.
      </p>

      <DebugNotes cases={DEBUG_CASES} title="Required debugging case" />
    </div>
  );
}
