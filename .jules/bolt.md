## 2025-05-14 - Optimized Live Update Loops
**Learning:** Intl.NumberFormat instantiation is a significant bottleneck in high-frequency (1s) update loops. In this codebase, moving it to a global/hoisted constant reduced tick duration by ~60%. Additionally, dirty checking (comparing value before updating textContent) and lazy DOM caching further minimized reflows and layout recalculations.
**Action:** Always hoist Intl formatters and use lazy DOM caching for repetitive UI updates.
