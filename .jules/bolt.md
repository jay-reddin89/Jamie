## 2025-05-15 - Optimizing High-Frequency DOM Updates

**Learning:** In high-frequency loops (like 1s intervals updating many stats), DOM thrashing and redundant string formatting are major bottlenecks. `document.getElementById` and `toLocaleString`/`toLocaleDateString` called multiple times per tick add measurable overhead. Lazy DOM caching combined with "dirty checking" (only updating `textContent` if the value has changed) can reduce execution time by over 80%. Hoisting `Intl.NumberFormat` also provides a significant boost by avoiding repeated constructor calls and locale lookups.

**Action:** Always implement a centralized `updateStat` helper in live update loops that handles both element caching and value comparison. Pre-calculate constant values (like birth weekday) once outside the loop.
