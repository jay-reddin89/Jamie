## 2025-05-15 - Optimizing High-Frequency Update Loops

**Learning:** High-frequency `setInterval` loops (1s) can be significantly optimized by:
1. **Lazy DOM Caching:** Storing element references on first use avoids expensive `document.getElementById` calls in subsequent ticks.
2. **Hoisting Formatters:** `Intl.NumberFormat` instances should be created once outside the loop. Repeated calls to `.toLocaleString()` are expensive as they instantiate a new formatter internally each time.
3. **Dirty Checking:** Comparing `textContent` before assignment prevents redundant DOM mutations, which minimizes browser reflow/repaint cycles.
4. **Pre-calculating Constants:** Values that don't change (like "Day Born" or the birth `Date` object) should be calculated once during initialization.

**Action:** Always check for high-frequency intervals and apply these patterns to ensure minimal main-thread blocking and smooth UI updates.
