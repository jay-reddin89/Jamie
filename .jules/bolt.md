## 2026-05-04 - High-Frequency Loop Optimization in script.js

**Learning:** `toLocaleString()` internally instantiates a new `Intl.NumberFormat` instance on every call, which is expensive when called multiple times within a 1s loop (e.g., 10+ calls per tick). Hoisting a single `Intl.NumberFormat` instance and calling `.format()` significantly reduces object allocation and execution time. Additionally, lazy DOM caching combined with dirty checking (`el.textContent !== String(val)`) prevents redundant reflows/paints even when the value is theoretically changing but visually identical.

**Action:** Always hoist `Intl` formatters outside of loops. Use a `liveStatsCache` object for lazy element lookups to avoid `document.getElementById` overhead in recurring intervals.
