## 2026-05-26 - [Optimized high-frequency biometric update loop]
**Learning:** High-frequency DOM updates (1s interval) in this application were causing significant overhead (~0.82ms/tick) due to repeated document.getElementById calls, Date object allocations, and redundant textContent assignments.
**Action:** Implemented lazy DOM element caching, pre-parsed Date of Birth timestamps, hoisted Intl.NumberFormat instances, and dirty checking (textContent !== val) to reduce tick duration to ~0.19ms (~76% improvement).
