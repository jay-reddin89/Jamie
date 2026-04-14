## 2025-05-15 - Live Stats Loop Optimization
**Learning:** High-frequency update loops (1s) can be a bottleneck when they involve repeated DOM lookups, object allocations (Date, Intl.NumberFormat), and redundant textContent updates. Using lazy DOM caching and dirty checking significantly reduces execution time per tick.
**Action:** Always hoist expensive object creations and implement dirty checking/caching for high-frequency DOM updates.
