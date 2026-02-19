## 2026-02-19 - [Optimized Live Counter Loop]
**Learning:** High-frequency (1s) loops that perform multiple DOM lookups and expensive string formatting (like `toLocaleString`) can cause measurable CPU spikes and jank, especially as the number of elements grows. Caching DOM references and implementing "dirty checking" significantly reduces the number of DOM writes and lookups.
**Action:** Always cache DOM elements in a persistent object and use an `isDirty` or `lastValue` check before updating `textContent` in repetitive loops.
