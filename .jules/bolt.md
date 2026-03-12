## 2025-05-14 - Optimized high-frequency dashboard updates
**Learning:** High-frequency (1s) intervals performing DOM mutations and Date parsing every second create unnecessary layout thrashing and CPU overhead.
**Action:** Use 'dirty checking' to skip redundant DOM writes, cache parsed Date objects, and use `Intl.NumberFormat` for faster number formatting.
