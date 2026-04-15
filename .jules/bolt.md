## 2025-05-15 - Live Counter Optimization
**Learning:** Frequent DOM updates (every second) across multiple counters can be a significant CPU bottleneck if not handled efficiently. Standard `document.getElementById` and `textContent` assignments trigger redundant operations even when the value hasn't changed.
**Action:** Use localized DOM element caching and strict equality dirty checking in high-frequency update loops to minimize layout thrashing and CPU overhead.
