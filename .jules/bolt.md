## 2025-05-15 - Intl.NumberFormat vs toLocaleString
**Learning:** `Intl.NumberFormat` is significantly faster than `toLocaleString()` for repeated number formatting in high-frequency loops. This is because `toLocaleString()` creates a new formatter object every time it's called, whereas `Intl.NumberFormat` can be instantiated once and reused.
**Action:** Always pre-instantiate `Intl.NumberFormat` when formatting numbers in intervals or high-frequency execution paths.
