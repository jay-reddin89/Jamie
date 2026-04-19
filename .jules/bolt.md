## 2025-05-14 - Optimized High-Frequency Live Updates

**Learning:** Implementing lazy DOM element caching, dirty checking, and hoisting `Intl.NumberFormat` instances can significantly reduce CPU overhead and garbage collection in high-frequency (1Hz+) update loops. In this case, it reduced tick execution time by ~66% (from 0.72ms to 0.24ms).

**Action:** Always look for `setInterval` or `requestAnimationFrame` loops that perform DOM lookups or object allocations (like `new Date()` or `new Intl.NumberFormat()`) and refactor them to use persistent caches and hoisted instances. Use a centralized helper like `updateStat` for clean implementation of dirty checking.
