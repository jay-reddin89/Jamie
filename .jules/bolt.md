## 2025-05-22 - Initial Performance Audit
**Learning:** Found that the application uses a 1-second interval to update multiple DOM elements with life statistics. These updates involve redundant DOM lookups and expensive `toLocaleString` calls.
**Action:** Implement DOM element caching and selective updates (dirty checking) to minimize layout thrashing and JS execution time. Use `Intl.NumberFormat` for faster number formatting.
