import { describe, expect, it } from 'vitest';
import { initialState, isValidIssueState, issueReducer } from './issueReducer.js';

function deepFreeze(value) {
  Object.values(value).forEach((child) => {
    if (child && typeof child === 'object' && !Object.isFrozen(child)) deepFreeze(child);
  });
  return Object.freeze(value);
}

const sampleState = () =>
  deepFreeze({
    issues: [
      { id: 1, title: 'Fix login bug', done: false },
      { id: 2, title: 'Write docs', done: true },
      { id: 3, title: 'Update logo', done: true }
    ],
    filter: 'all',
    nextId: 4
  });

describe('issueReducer', () => {
  it('ADD_ISSUE appends a trimmed open issue and increments nextId', () => {
    const state = deepFreeze({ ...initialState, issues: [] });

    const next = issueReducer(state, { type: 'ADD_ISSUE', payload: { title: '  Fix login  ' } });

    expect(next.issues).toEqual([{ id: 1, title: 'Fix login', done: false }]);
    expect(next.nextId).toBe(2);
    expect(next).not.toBe(state);
    expect(state.issues).toHaveLength(0);
  });

  it('TOGGLE_ISSUE flips only the matching issue and creates a new issue object', () => {
    const state = sampleState();

    const next = issueReducer(state, { type: 'TOGGLE_ISSUE', payload: { id: 1 } });

    expect(next.issues[0]).toEqual({ id: 1, title: 'Fix login bug', done: true });
    expect(next.issues[0]).not.toBe(state.issues[0]);
    expect(next.issues[1]).toBe(state.issues[1]);
    expect(state.issues[0].done).toBe(false);

    const back = issueReducer(next, { type: 'TOGGLE_ISSUE', payload: { id: 1 } });
    expect(back.issues[0].done).toBe(false);
  });

  it('CLEAR_DONE removes completed issues and keeps open ones and nextId', () => {
    const state = sampleState();

    const next = issueReducer(state, { type: 'CLEAR_DONE' });

    expect(next.issues).toEqual([{ id: 1, title: 'Fix login bug', done: false }]);
    expect(next.nextId).toBe(4);
    expect(state.issues).toHaveLength(3);
  });

  it('DELETE_ISSUE removes only the matching issue', () => {
    const next = issueReducer(sampleState(), { type: 'DELETE_ISSUE', payload: { id: 2 } });

    expect(next.issues.map((issue) => issue.id)).toEqual([1, 3]);
  });

  it('SET_FILTER updates the filter and ignores unknown filters', () => {
    const state = sampleState();

    expect(issueReducer(state, { type: 'SET_FILTER', payload: { filter: 'done' } }).filter).toBe(
      'done'
    );
    expect(issueReducer(state, { type: 'SET_FILTER', payload: { filter: 'bogus' } })).toBe(state);
  });

  it('ADD_ISSUE ignores blank titles', () => {
    const state = sampleState();

    expect(issueReducer(state, { type: 'ADD_ISSUE', payload: { title: '   ' } })).toBe(state);
  });

  it('returns the existing state for unknown actions', () => {
    const state = sampleState();

    expect(issueReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });
});

describe('isValidIssueState', () => {
  it('accepts the initial state and rejects malformed data', () => {
    expect(isValidIssueState(initialState)).toBe(true);
    expect(isValidIssueState(null)).toBe(false);
    expect(isValidIssueState({ issues: 'nope', filter: 'all', nextId: 1 })).toBe(false);
    expect(isValidIssueState({ issues: [], filter: 'weird', nextId: 1 })).toBe(false);
  });
});
