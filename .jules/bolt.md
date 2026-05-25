## 2025-05-15 - [High-Frequency Loop Optimization & Repository Hygiene]
**Learning:** Optimizing a 1s interval loop using hoisted `Intl.NumberFormat` and closure-based DOM dirty-checking reduced tick duration by ~72% (0.75ms -> 0.21ms). However, the "Bolt" persona must be extremely vigilant about repository hygiene, as including build artifacts (dist/) and logs (dev_server.log) violates strict source-control standards.
**Action:** Implement local dirty-checking for all high-frequency DOM updates and always run a cleanup step to remove `dist/` and temporary logs before submission.
