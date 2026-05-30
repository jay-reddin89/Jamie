## 2026-04-24 - [High-Frequency Update Bottlenecks]
**Learning:** In loops running every second, the primary performance bottleneck is often DOM access and locale-aware string formatting (`toLocaleDateString`, `toLocaleString`), not the mathematical calculations. Moving DOM lookups and constant formatting outside the interval loop yields significant gains (~90%+ reduction in tick time) without sacrificing accuracy.
**Action:** Always cache DOM elements and hoist formatters (like `Intl.NumberFormat`) when implementing live update counters.

## 2026-04-24 - [Correctness vs. Micro-Optimization]
**Learning:** Replacing calendar-accurate date logic (like `calculateAge`) with approximations (e.g., `days / 365.25`) provides negligible performance benefits in a 1Hz loop but introduces rounding errors. Accuracy is a feature.
**Action:** Preserve existing functional parity and accuracy; focus optimizations on expensive side effects (DOM/I/O) rather than core business logic unless a specific bottleneck is measured there.
