## 2026-04-23 - [Optimized Live Updates]
**Learning:** Performance of high-frequency DOM updates can be significantly improved by implementing lazy DOM caching and dirty checking, as well as hoisting formatters and pre-calculating constants.
**Action:** Always implement these patterns for high-frequency loops (>1Hz) to minimize CPU overhead.
