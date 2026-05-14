## 2024-07-24 - High-Frequency Loop Optimization Pattern
**Learning:** In the LIFE.STATS dashboard, the `startLiveUpdates` interval is a major performance bottleneck due to redundant DOM queries, high-frequency object allocations (`new Date()`), and expensive localization calls (`toLocaleString`). Using `Intl.NumberFormat` hoisted outside the loop and implementing "dirty checking" for DOM updates provides massive efficiency gains.
**Action:** Always hoist formatters and use lazy DOM caching with the `in` operator for any interval-based UI updates in this repository.
