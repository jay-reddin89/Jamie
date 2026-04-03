## 2025-05-15 - High-Frequency Loop Optimization

**Learning:** In applications with high-frequency UI updates (e.g., 1s intervals), redundant `new Date()` allocations, repeated `document.getElementById` calls, and `toLocaleDateString` overhead are major CPU bottlenecks. Implementing lazy DOM caching and dirty checking effectively eliminates these costs.

**Action:** Always hoist `Intl.NumberFormat` and pre-calculate expensive string derivations (like days of the week) during state transitions (save/load) rather than inside the tick. Use dirty checking (`textContent !== newValue`) to prevent redundant browser layout/paint work.
