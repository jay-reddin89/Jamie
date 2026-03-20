## 2026-03-20 - High-frequency DOM Update Optimizations
**Learning:** Hoisting `Intl.NumberFormat` and pre-parsing dates into timestamps significantly reduces allocation pressure in 1s update loops. Inlining simple logic like seconds/minutes calculation avoids function call overhead.
**Action:** Always pre-parse dates and hoist formatters when implementing real-time counters.

## 2026-03-20 - Robust DOM Caching
**Learning:** Stale DOM element caching can break UI updates if elements are injected after the loop starts or re-rendered later.
**Action:** Use `.isConnected` and null checks in lazy caching logic to ensure references are valid and up-to-date.
