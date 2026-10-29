# Bolt's Journal - Performance Learnings

## 2026-03-29 - Eliminate Double State Updates in Simulation Intervals
**Learning:** Updating state in an `setInterval` tick and relying on a separate `useEffect([state])` to sync dependent state (like history logs) causes two consecutive state updates and re-renders per interval tick.
**Action:** Compute the next state using a `ref` inside the interval tick and dispatch all state updates synchronously in a single batch.
