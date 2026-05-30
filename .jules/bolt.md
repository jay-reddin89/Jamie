## 2025-05-14 - Optimization of high-frequency DOM updates
**Learning:** High-frequency UI logic (1s intervals) in this application repeatedly parses date strings and performs redundant DOM mutations and object instantiations, leading to unnecessary CPU and memory overhead.
**Action:** Implement 'dirty checking' for DOM updates, cache DOM element references, pre-instantiate `Intl.NumberFormat` for number formatting, and cache parsed Date objects in the global state to minimize overhead in the 1-second update loop.
