## 2026-05-07 - [Optimization of High-Frequency Loops]
**Learning:** `toLocaleString()` internally instantiates a new `Intl.NumberFormat` instance on every call, which is extremely expensive in high-frequency (1s) loops. Hoisting a single instance and calling `.format()` reduces execution time by ~90%. Additionally, lazy DOM caching and dirty checking (comparing `textContent`) significantly reduce layout thrashing.
**Action:** Always hoist formatters and cache DOM element references in high-frequency update loops. Implement dirty checking to minimize DOM writes.
