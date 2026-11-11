# Bolt's Journal - Performance Learnings

## 2026-03-29 - Eliminate Double State Updates in Simulation Intervals
**Learning:** Updating state in an `setInterval` tick and relying on a separate `useEffect([state])` to sync dependent state (like history logs) causes two consecutive state updates and re-renders per interval tick.
**Action:** Compute the next state using a `ref` inside the interval tick and dispatch all state updates synchronously in a single batch.
# Bolt's Journal

## 2026-03-31 - React State Update Synchronization in Timer Hooks
**Learning:** In simulation hooks driven by `setInterval`, computing next values in a single step rather than chaining state updates via `useEffect` avoids cascaded re-renders and redundant array allocations.
**Action:** Always compute derived interval state inline within the timer callback instead of using secondary `useEffect` sync hooks.
## 2026-03-31 - React Interval State Update Batching
**Learning:** Watching state variables (like `gasLevel`) in a secondary `useEffect` to sync derived state (like `history`) triggers double re-renders on every tick. Consolidating state calculation inside the timer callback using `useRef` for the latest value allows batching state updates in a single pass without re-creating the interval timer.
**Action:** Always compute new state values synchronously in timer callbacks and update dependent states together in a single pass.
## 2025-02-16 - Avoid redundant useEffect state syncs in timer loops
**Learning:** Updating state in a timer callback (`setInterval`) with temporary values and relying on a secondary `useEffect([state])` to patch dependent state causes double re-renders on every tick (e.g. 4 renders/sec instead of 2 renders/sec for 500ms ticks).
**Action:** Compute updated values directly in the timer callback and batch state updates atomically in a single render cycle using `useRef` to access current state.
## 2026-10-27 - Isolating Clock State to Prevent Dashboard Component Tree Re-renders
**Learning:** Holding clock/timer state (`setInterval` updating `now` state every second) at the top level of a large dashboard page causes the entire component tree and all child JSX specs to re-evaluate every second.
**Action:** Always extract high-frequency local display timers (such as header clocks) into dedicated memoized components (`React.memo`) to scope re-renders to the clock element alone.
