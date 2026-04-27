## 2025-05-15 - High-Frequency Interval Optimization
**Learning:** Repetitive DOM queries and object allocations (like `new Date()`, `toLocaleString()`) inside 1s intervals add significant overhead and cause GC pressure.
**Action:** Implement lazy DOM caching, hoist formatting instances (`Intl.NumberFormat`), and pre-calculate constants outside the loop to reduce tick duration by >90%.
