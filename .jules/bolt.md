## 2026-03-06 - High-Frequency Loop Optimization Pattern
**Learning:** In vanilla JS applications with 1s intervals (tickers), significant overhead comes from redundant `new Date()` parsing, `document.getElementById` lookups, and `toLocaleString()` calls. `Intl.NumberFormat` is measurably faster (~8x) for formatting numbers in these loops.
**Action:** Always implement a `domCache` for repeated element access and a `lastValues` object for "dirty checking" before writing to the DOM. Pre-parse `Date` objects and reuse a single `Intl.NumberFormat` instance globally.
