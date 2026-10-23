# Bolt's Journal

## 2026-03-31 - React State Update Synchronization in Timer Hooks
**Learning:** In simulation hooks driven by `setInterval`, computing next values in a single step rather than chaining state updates via `useEffect` avoids cascaded re-renders and redundant array allocations.
**Action:** Always compute derived interval state inline within the timer callback instead of using secondary `useEffect` sync hooks.
