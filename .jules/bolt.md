## 2025-05-14 - Optimized Live Update Loops
**Learning:** High-frequency DOM updates (1Hz) are significantly impacted by repeated string-to-Date parsing, toLocaleString object creation, and getElementById calls.
**Action:** Always cache DOM elements in a closure, hoist Intl.NumberFormat instances, and pre-calculate constants like birth weekday outside the update loop.

## 2025-05-14 - Performance vs Accuracy Trade-off
**Learning:** Replacing calendar-based calculations with simple division (e.g., diff / 31557600000 for years) can lead to inaccuracies due to leap years.
**Action:** Retain original complex logic for accuracy-critical metrics while optimizing the surrounding environment (DOM access, formatting).
