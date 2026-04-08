## 2025-05-14 - High-Frequency Biometric Loop Optimization
**Learning:** In applications with high-frequency UI updates (e.g., 1Hz biometrics), repeated DOM lookups, date parsing, and locale-aware string formatting (`toLocaleString`) are significant performance bottlenecks that can consume ~0.5ms+ per tick on the main thread.
**Action:** Implement lazy DOM element caching, dirty checking for textContent, and hoist `Intl.NumberFormat` instances. Pre-calculate non-changing derived values (like day of the week) during data load/save to minimize work inside the interval.
