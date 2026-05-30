## 2026-03-01 - Optimized High-Frequency UI Loops
**Learning:** High-frequency (1s) intervals in vanilla JS apps are prone to CPU spikes from redundant DOM lookups and Date parsing. Intl.NumberFormat provides ~8x speedup over toLocaleString() for number formatting.
**Action:** Always implement DOM caching, dirty checking, and pre-instantiated formatters for any interval < 2s.
