## 2025-05-22 - Intl.NumberFormat Performance in High-Frequency Loops
**Learning:** Calling `toLocaleString()` inside a `setInterval` or `requestAnimationFrame` loop is a significant performance bottleneck. Internally, browsers instantiate a new `Intl.NumberFormat` object on every call, which is expensive in terms of CPU and memory.
**Action:** Always hoist `Intl.NumberFormat` instances outside of loops and use the `.format()` method for a ~90% reduction in per-tick execution overhead.
