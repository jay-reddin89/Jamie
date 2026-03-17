## 2025-03-16 - DOM Caching and Dirty Checking Pattern
**Learning:** In high-frequency update loops (1s intervals), DOM manipulation via `textContent` can still be optimized significantly by dirty checking against a local state cache. Even simple text updates incur minor overhead that adds up when multiple elements are touched.
**Action:** Always implement a `domCache` and `lastValues` pattern for `setInterval` loops that touch more than 5 elements.

## 2025-03-16 - Performance of Intl.NumberFormat
**Learning:** `Intl.NumberFormat().format()` is consistently faster than `Number.toLocaleString()` in this environment, especially when the formatter is instantiated once and reused.
**Action:** Prefer `Intl.NumberFormat` for any numeric formatting inside high-frequency loops.
