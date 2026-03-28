## 2025-05-15 - Robust DOM Caching for Re-rendered SPAs
**Learning:** In SPAs where entire sections are cleared and re-rendered via `innerHTML`, a simple `domCache` will hold references to detached elements. Verifying element persistence using the `.isConnected` property is crucial for a robust cache that automatically refreshes when components are re-created.
**Action:** Always include a `isConnected` check in high-frequency DOM caches to handle dynamic UI transitions correctly.

## 2025-05-15 - Fast Numeric Updates with `Intl.NumberFormat`
**Learning:** `Intl.NumberFormat().format()` is significantly faster (~6.5x) than `Number.toLocaleString()` in high-frequency update loops. Pre-instantiating the formatter outside the loop further minimizes allocation and garbage collection overhead.
**Action:** Use pre-instantiated `Intl.NumberFormat` for all recurring numeric telemetry updates.
