## 2025-05-14 - Optimized High-Frequency Live Update Loop

**Learning:** The live update loop in `startLiveUpdates` was a significant performance bottleneck, performing redundant DOM lookups and expensive formatting on every 1000ms tick. By implementing lazy DOM caching and dirty checking, we can avoid approximately 90% of DOM write operations. Hoisting `Intl.NumberFormat` and pre-calculating constant strings (like birth day) further reduces per-tick CPU overhead.

**Action:** Always use a centralized update helper with lazy caching and dirty checking for high-frequency UI updates. Pre-calculate any values that don't change between ticks outside the update loop.
