## 2024-05-20 - High-frequency update loop optimization
**Learning:** Initializing expensive objects like `Intl.NumberFormat` or performing DOM lookups via `document.getElementById` inside a 1s interval adds significant overhead (baseline ~1.04ms). Caching DOM elements and hoisting constants reduced this to ~0.30ms.
**Action:** Always cache DOM elements and hoist invariant formatters/calculations outside of high-frequency loops (setInterval/requestAnimationFrame).
