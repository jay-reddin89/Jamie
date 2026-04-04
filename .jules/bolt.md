## 2025-05-15 - Live Stats Loop Optimization
**Learning:** High-frequency `setInterval` loops (1s) in vanilla JS can cause cumulative main thread pressure if they include redundant DOM lookups, date parsing, and string formatting. Caching DOM elements and using `Intl.NumberFormat` instead of `toLocaleString` significantly reduces execution time.
**Action:** Always hoist expensive object allocations (Date, Formatters) and DOM lookups out of high-frequency intervals. Implement dirty checking (comparing value before updating `textContent`) to minimize layout thrashing.
