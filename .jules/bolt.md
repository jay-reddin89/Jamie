## 2026-03-06 - Optimizing high-frequency update loop
**Learning:** The 1s live update loop in `script.js` is a significant source of DOM overhead due to repetitive `document.getElementById` calls, `new Date()` instantiations, and redundant DOM writes. Pre-caching elements, dirty checking, and using `Intl.NumberFormat` provide measurable efficiency gains.
**Action:** Implement `domCache`, `lastValues` for dirty checking, and pre-instantiated `Intl.NumberFormat`. Pre-parse DOB to avoid redundant date parsing.
