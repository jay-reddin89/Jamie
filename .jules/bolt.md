## 2025-05-15 - DOM Caching and Dirty Checking Pattern
**Learning:** High-frequency UI updates (1s intervals) in this codebase originally suffered from DOM thrashing and redundant date formatting. Caching elements and using `Intl.NumberFormat` significantly reduces CPU overhead.
**Action:** Always implement a `domCache` and use dirty checking for live counters to avoid unnecessary layout shifts and main-thread blocking.
