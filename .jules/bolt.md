## 2026-03-31 - React Interval State Update Batching
**Learning:** Watching state variables (like `gasLevel`) in a secondary `useEffect` to sync derived state (like `history`) triggers double re-renders on every tick. Consolidating state calculation inside the timer callback using `useRef` for the latest value allows batching state updates in a single pass without re-creating the interval timer.
**Action:** Always compute new state values synchronously in timer callbacks and update dependent states together in a single pass.
