## 2025-05-15 - DOM Reflow Bottleneck in High-Frequency Updates
**Learning:** In dashboards with 1-second update intervals, redundant `document.getElementById` calls and `textContent` writes (even if the value is the same) trigger expensive layout/reflow cycles. `Intl.NumberFormat` is also significantly faster (~8x) than `toLocaleString()`.
**Action:** Always implement a `domCache` and 'dirty checking' (comparing against `lastValues`) for high-frequency DOM updates. Use a pre-instantiated `Intl.NumberFormat` for numeric formatting.
