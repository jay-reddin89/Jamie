## 2025-05-15 - Live Update Loop Optimization
**Learning:** High-frequency updates (1s) to the DOM are expensive due to repeated layout/paint cycles and DOM traversal if elements are not cached. Pre-calculating static values and using lazy caching significantly reduces CPU overhead.
**Action:** Always hoist non-changing calculations (like formatters or static date strings) out of intervals. Use an `elementsCache` for lazy DOM lookups and implement dirty checking (`el.textContent !== val`) to avoid redundant DOM writes.
