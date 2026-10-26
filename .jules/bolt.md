## 2025-02-16 - Avoid redundant useEffect state syncs in timer loops
**Learning:** Updating state in a timer callback (`setInterval`) with temporary values and relying on a secondary `useEffect([state])` to patch dependent state causes double re-renders on every tick (e.g. 4 renders/sec instead of 2 renders/sec for 500ms ticks).
**Action:** Compute updated values directly in the timer callback and batch state updates atomically in a single render cycle using `useRef` to access current state.
