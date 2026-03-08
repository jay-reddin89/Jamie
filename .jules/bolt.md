## 2025-05-14 - Optimized High-Frequency Update Loop
**Learning:** `Intl.NumberFormat` is significantly faster (~7-8x) than `Number.prototype.toLocaleString()` because it avoids re-initializing the internationalization engine on every call. In a 1-second update loop, this saves considerable CPU cycles.
**Action:** Use pre-instantiated `Intl` formatters and implement dirty-checking for DOM updates to minimize reflows/paints.
