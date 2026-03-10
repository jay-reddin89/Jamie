## 2025-05-15 - [High-Frequency Update Loop Optimization]
**Learning:** In applications with 1-second interval loops updating 15+ DOM elements, the cumulative overhead of `new Date()` (parsing), `document.getElementById()`, and `toLocaleString()` is measurable. `Intl.NumberFormat` is ~8x faster than `toLocaleString()` in Chrome, and DOM caching with "dirty checking" reduces layout/reflow costs by skipping redundant `textContent` writes.

**Action:** Always pre-instantiate `Intl.NumberFormat` and implement `domCache`/`lastValues` for any high-frequency UI updates to maintain 60fps and reduce CPU usage.
