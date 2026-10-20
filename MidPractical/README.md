# React Hooks Practical Exam

One Vite + React project containing all six practical exams. Use the tabs at the top of the page to switch between exams. Each exam page has a "Required debugging case(s)" section with the faulty code, the repaired code and the explanation.

## Run

```bash
npm install
npm run dev      # open the URL printed in the terminal
npm test         # reducer tests for Exam 6
npm run build    # optional production build check
```

Only React Hooks are used for state logic. No state management library is installed. Dependencies: `react`, `react-dom`; dev tools: `vite`, `@vitejs/plugin-react`, `vitest`.

## Completed requirements

### Exam 1: Smart Task Counter (useState)
- `count` (0) and `target` (5) state with Target minus/plus controls (range 1 to 99).
- Increment, Decrement and Reset. Count never goes below 0 (clamped, and Decrement is disabled at 0). Reset returns count to 0.
- Plus two uses two queued functional updates (`setCount(c => c + 1)` twice) and adds exactly two.
- Status (Not started, In progress, Target reached) is derived during render. There is no status state.
- Increment and Plus two are disabled once `count >= target`.
- Debugging case: stale `count + 1` explained in the app.

### Exam 2: Live Search and Timer (useEffect)
- Query filtering runs inside an effect with a 400 ms simulated request using the supplied `USERS`.
- The effect cleanup cancels the previous timeout, so outdated results are never shown.
- One second session timer with cleanup on unmount (use "Unmount timer" / "Mount timer").
- `document.title` is synchronized with the visible result count.
- Debugging cases: self-dependent effect, stale timer callback, cleanup explanation.

### Exam 3: Accessible Form Toolkit (useRef, useState)
- Controlled name, email and password inputs; refs attached with the `ref` attribute.
- Validation: required name, valid email structure, password of at least 8 characters. All errors are shown with `role="alert"` and `aria-describedby`.
- The first invalid field is focused in the order name, email, password.
- The previous successful email is kept in a ref, read and written only in the submit handler. It is shown after the next successful submission.
- Debugging case: ref value that does not update the screen, replaced with state.

### Exam 4: Application Preferences (useContext, useState)
- One context (`PreferencesContext.js`), one provider, tree: PreferencesApp (App) > PreferencesProvider > Dashboard > Toolbar, PreferencesPanel, ArticlePreview.
- Shares `theme`, `fontSize`, `toggleTheme` and `setFontSize` (14, 16 or 18 px).
- `usePreferences` throws a clear error outside the provider.
- Debugging cases: missing provider, two context objects, why context removes prop drilling.

### Exam 5: Product Explorer Performance Repair (useMemo, useCallback)
- 800 deterministic generated products, text search, category selection, price sorting.
- Filtered and sorted list in `useMemo` with `[query, category, sortOrder]`.
- Selection handler in `useCallback` with `[selectedId]`.
- `ProductList` wrapped in `React.memo`; an unrelated counter is in the parent.
- Analytics runs in `useEffect`, not in `useMemo`.
- Debugging cases: missing `query` dependency, missing `selectedId` dependency, analytics moved out of `useMemo`.

**When memoization is unnecessary:** a cheap calculation, for example filtering a list of ten items or concatenating two strings, costs less than the work `useMemo` itself does (storing the previous result and comparing the dependency array). Memoizing it adds complexity with no measurable benefit. `useMemo` also gives nothing for a value that changes on every render (its dependency changes each time) or for a primitive value, which is already compared by value.

### Exam 6: Issue Tracker State Engine (useReducer, custom Hook)
- State shape `{ issues: [], filter: 'all', nextId: 1 }` and all five actions (`ADD_ISSUE`, `TOGGLE_ISSUE`, `DELETE_ISSUE`, `SET_FILTER`, `CLEAR_DONE`).
- Pure, immutable reducer; the default branch returns the existing state.
- `usePersistentReducer` loads from localStorage once (lazy initializer) and saves after every state change.
- All, Open and Done views with counts derived from the full list.
- Tests in `src/exams/Exam6/issueReducer.test.js` (add, toggle, clear completed, plus extra cases). Sample states are deep frozen, so any mutation fails the test.
- Debugging cases: mutation, action shape mismatch, default branch returning `undefined`.

## Test steps

1. **Exam 1:** use "Case: target 5, count 0", then Increment. Use "Case: target 5, count 4", then Plus two: count becomes 6 and both Increment and Plus two become disabled. At count 0, Decrement stays at 0. After reaching the target, press Reset: count returns to 0.
2. **Exam 2:** type quickly (for example "d", "de", "dev"): only the final result appears after the delay. Watch the title and the timer; unmount and mount the timer and confirm it counts once per second.
3. **Exam 3:** submit empty (name focused), fill name only (email focused), valid email with a short password (password focused). Submit successfully twice with different emails; the second success shows the first email as the previous one.
4. **Exam 4:** toggle the theme in the Toolbar or Panel and change the font size; Dashboard and ArticlePreview update together.
5. **Exam 5:** open the browser console. Click the unrelated counter: no `[ProductList] render` and no `[explorer] list recalculated` log. Change search, category or sort: both appear. Selecting a product re-renders the list because the selection changed.
6. **Exam 6:** add, toggle, delete, filter and clear issues; refresh the page and confirm they persist. Run `npm test`.

## Known limitations

- Exam 1: Plus two at count 4 with target 5 gives 6 (it always adds exactly two, as required); it is not clamped to the target.
- Exam 2: the "search request" is simulated with a timeout; the timer restarts at 0 after remounting.
- Exam 3: the form clears after a successful submission and nothing is sent to a server. The previous email is kept only while the page is open.
- Exam 5: in development, React Strict Mode runs effects twice on first mount, so the first analytics and recalculation logs can appear twice. This does not happen on later interactions. The product data is small enough that the filter is cheap; the memoization is demonstrated with the console logs.
- Exam 6: persistence uses one localStorage key (`exam6.issue-tracker.v1`); invalid stored data is ignored and the tracker starts empty.
- Tests cover the reducer only; components are verified manually using the steps above.

## Demonstration bug (explain one)

Replace this with a bug you personally ran into. A good example from this project is Exam 1 Plus two: `setCount(count + 1)` twice only adds one because both calls use the same captured `count` from the current render. The fix is two functional updates, `setCount(c => c + 1)`, which React queues and applies one after another.
