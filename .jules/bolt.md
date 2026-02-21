## 2025-05-15 - Dashboard Live Update Loop Optimization
**Learning:** High-frequency UI updates (e.g., 1s intervals) can become a performance bottleneck if they involve redundant Date object creation, frequent DOM lookups, and expensive formatting like `toLocaleString`. Caching DOM references and pre-parsing stable data (like DOB) significantly reduces CPU overhead and garbage collection churn.
**Action:** Always cache DOM elements and use shared `Intl.NumberFormat` instances in frequent loops. Avoid creating more than one `new Date()` per tick if possible.
