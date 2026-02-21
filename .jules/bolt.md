## 2026-02-21 - Optimizing High-Frequency Update Loops

**Learning:** In applications with 1-second update loops (like live dashboards), redundant `document.getElementById` calls and repeated `new Date()` parsing of the same date string can create significant CPU overhead. Additionally, starting multiple intervals without clearing existing ones in an SPA leads to memory leaks and performance degradation.

**Action:**
- Cache DOM elements used in intervals.
- Pre-parse persistent date strings into `Date` objects upon loading/saving.
- Use a single, shared `Intl.NumberFormat` for faster number formatting.
- Always clear existing intervals before starting new ones.
- Ensure entry-point scripts are marked as `type="module"` when using Vite for correct production bundling.
