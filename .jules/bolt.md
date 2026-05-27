# Bolt's Performance Journal

## 2025-05-15 - [High-Frequency Loop Optimization]
**Learning:** High-frequency updates (1s interval) were expensive due to redundant DOM lookups, locale-aware string formatting, and constant `Date` object allocations. `toLocaleDateString` is particularly slow inside loops.
**Action:** Implement lazy DOM caching, hoist invariant calculations (like born-day), use `Intl.NumberFormat` instead of `toLocaleString`, and perform timestamp arithmetic instead of creating new `Date` objects. Added dirty checking to avoid redundant DOM writes.
