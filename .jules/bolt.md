## 2026-04-02 - Initializing Bolt Journal
**Learning:** High-frequency update loops in `script.js` (`startLiveUpdates`) and `Refresh/script.js` (`updateLiveCounters`) contain multiple performance bottlenecks: redundant DOM lookups, repeated Date object allocations, and expensive string formatting within 1s ticks.
**Action:** Implement DOM caching, pre-calculate static date-related values, and hoist `Intl.NumberFormat` instances to optimize the main thread during live updates.
