## 2025-05-15 - High-Frequency DOM Optimization
**Learning:** High-frequency (1s) intervals for live counters benefit significantly from DOM element caching and dirty checking. Using a hoisted `Intl.NumberFormat` instance instead of repeated `toLocaleString()` calls further reduces CPU overhead by preventing redundant object allocations on every tick.
**Action:** Always implement lazy element caching and dirty checking for high-frequency UI updates to minimize layout reflows and browser painting.
