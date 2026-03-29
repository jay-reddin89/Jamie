## 2026-02-17 - High-Frequency Loop Optimization in Vanilla JS

**Learning:** Intervals running at 1s or less (high-frequency) can significantly benefit from lazy DOM caching and dirty checking to avoid layout thrashing. Hoisting formatters like `Intl.NumberFormat` and pre-calculating static date strings outside the loop reduces garbage collection and CPU cycles.

**Action:** Always check for `setInterval` or `requestAnimationFrame` loops and apply a `domCache` + `updateStat` helper pattern for DOM updates. Pre-calculate any string derivations that don't change between ticks.
