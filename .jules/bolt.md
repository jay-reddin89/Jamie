## 2025-05-14 - Optimized high-frequency update loop

**Learning:** In high-frequency update loops (e.g., 1s intervals), redundant `Date` object allocations and DOM lookups are significant performance bottlenecks. Hoisting invariant calculations (like day of birth name) and implementing lazy DOM caching with dirty checking can drastically reduce execution time by ~81% (from 0.37ms to 0.07ms per tick).

**Action:** Always implement DOM caching and dirty checking for live updates. Use `Date.now()` and pre-calculated timestamps instead of creating new `Date` objects inside loops.
