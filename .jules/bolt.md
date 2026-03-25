## 2024-03-24 - High-Frequency Loop Optimization
**Learning:** In a vanilla JS 1s update loop, DOM queries and `toLocaleString` are the primary bottlenecks. Caching DOM elements and reusing a single `Intl.NumberFormat` instance, combined with dirty checking to skip redundant `textContent` writes, can reduce iteration time by over 50%.
**Action:** Always hoist formatting instances and implement a unified `updateStat` helper that combines caching and dirty checking for any high-frequency UI updates.
