## 2026-04-26 - Optimized high-frequency live update loop
**Learning:** Repetitive DOM lookups and object allocations (like Intl.NumberFormat) in a 1Hz interval loop can be significantly reduced (~60% in this case) by implementing a local closure-based cache and hoisting formatters/constants.
**Action:** Always check for redundant 'document.getElementById' and '.toLocaleString()' calls in setInterval loops and move static data outside the loop.
