## 2025-05-14 - Optimized high-frequency UI updates
**Learning:** In high-frequency loops (1s intervals), DOM mutations and object allocations (like `new Date()`, `toLocaleString()`) are the primary performance killers.
**Action:** Always implement lazy DOM caching and dirty checking for live counters. Pre-instantiate `Intl.NumberFormat` instead of using `toLocaleString()`.
