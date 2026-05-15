## 2025-01-24 - [Optimizing High-Frequency DOM Updates]
**Learning:** In high-frequency loops (e.g., 1s intervals), `toLocaleString()` is a significant bottleneck due to the implicit instantiation of `Intl.NumberFormat` on every call. Hoisting a single instance and calling `.format()` can reduce execution time dramatically. Additionally, dirty checking against `textContent` prevents redundant DOM writes that trigger layout/paint cycles.
**Action:** Always hoist `Intl.NumberFormat` and implement lazy DOM element caching for any recurring update logic.
