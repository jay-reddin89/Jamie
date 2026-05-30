## 2025-05-15 - [Optimize Live Update Loop]
**Learning:** `Intl.NumberFormat` is significantly faster (~8x) than `toLocaleString()` for frequent number formatting in high-frequency update loops. Implementing 'dirty checking' by comparing values before DOM writes, combined with `domCache` for element references, drastically reduces CPU overhead and layout thrashing in 1-second interval dashboards.
**Action:** Always pre-instantiate `Intl.NumberFormat` outside of loops and use a `lastValues` cache to prevent redundant DOM mutations in high-frequency UI logic.
