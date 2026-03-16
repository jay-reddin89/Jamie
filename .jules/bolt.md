## 2025-05-14 - High-Frequency Loop Optimization
**Learning:** In high-frequency update loops (e.g., 1s intervals), DOM mutations and object instantiations are major bottlenecks. `Intl.NumberFormat` is significantly faster (~6.5x in this env) than `toLocaleString()`. Lazy DOM caching and dirty checking can reduce layout/reflow overhead by avoiding redundant `textContent` writes.
**Action:** Always pre-instantiate formatters and implement dirty checking when dealing with frequent UI updates. Pre-parse data (like dates) outside the loop.
