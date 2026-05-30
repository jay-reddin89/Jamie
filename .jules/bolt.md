## 2025-05-15 - Intl.NumberFormat vs toLocaleString in High-Frequency Loops
**Learning:** `toLocaleString()` internally instantiates a new `Intl.NumberFormat` instance on every call, which is extremely expensive when executed in a 1s loop updating dozens of elements. Hoisting a single `Intl.NumberFormat` instance and calling its `.format()` method reduces execution time of the formatting logic by ~90%.
**Action:** Always hoist `Intl.NumberFormat` instances to the top level or a stable closure when performing high-frequency numeric updates.

## 2025-05-15 - DOM Caching for Live Counters
**Learning:** Sequential `document.getElementById` calls in a `setInterval` loop create significant main-thread overhead as the number of counters grows (13+ in this app).
**Action:** Implement lazy DOM caching by storing element references once before the interval starts or upon first access within the loop.
