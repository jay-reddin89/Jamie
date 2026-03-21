## 2025-05-15 - DOM Update Optimization
**Learning:** Using `Intl.NumberFormat` instead of `toLocaleString` in a high-frequency loop (1s) is significantly faster (approx 6.5x). Dirty checking before updating `textContent` also prevents unnecessary layout recalculations.
**Action:** Always hoist formatters and use a dirty checking helper for live data updates.
