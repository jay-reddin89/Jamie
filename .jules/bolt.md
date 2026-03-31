## 2026-03-31 - Initial Performance Audit
**Learning:** Found several performance bottlenecks in the high-frequency update loops (`setInterval` at 1000ms):
1. Redundant `new Date()` and string-to-Date conversions in every tick.
2. Repeated DOM lookups (`document.getElementById`) for the same elements.
3. Lack of "dirty checking" before updating DOM `textContent`, causing unnecessary layout work.
4. Heavy string operations like `toLocaleDateString` and capitalization happening in the loop.

**Action:** Implement a centralized DOM cache, pre-calculate stable state (like birth Date objects and bornDay strings), and use a helper for dirty-checked DOM updates.
