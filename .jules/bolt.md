## 2026-03-05 - Optimized high-frequency live update loop
**Learning:** High-frequency (1s) DOM update loops are a major performance bottleneck if they involve redundant DOM lookups, repeated date parsing, and expensive number formatting like `.toLocaleString()`.
**Action:** Always implement `domCache` for element references, `lastValues` for "dirty checking" to skip redundant mutations, and pre-instantiate `Intl.NumberFormat` for high-performance formatting in intervals.
