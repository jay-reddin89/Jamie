## 2026-03-28 - Optimizing High-Frequency DOM Updates

**Learning:** Re-parsing `Date` objects from strings and calling `toLocaleDateString` in a `setInterval(..., 1000)` loop is a significant source of main-thread overhead (~0.34ms per iteration in this environment). Additionally, redundant DOM writes to `textContent` trigger unnecessary browser work even when values haven't changed.

**Action:** Implement a "Dirty Checking" helper combined with a lazy DOM element cache. Pre-calculate invariant data (like the birth day string and pre-parsed Date objects) during data load/save operations to minimize work performed during each tick. Hoist expensive objects like `Intl.NumberFormat` outside the interval scope.
