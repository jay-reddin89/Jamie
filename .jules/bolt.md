## 2025-05-15 - Live Update Loop Optimization
**Learning:** High-frequency loops (1s ticks) in the main thread benefit significantly from DOM caching and avoiding repeated object allocations (like `new Date()`) or heavy formatting calls (`toLocaleString`).
**Action:** Always hoist `Intl.NumberFormat` and cache DOM elements when updating multiple elements in a `setInterval` or `requestAnimationFrame` loop.
