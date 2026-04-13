## 2025-05-15 - Live Update Loop Optimization
**Learning:** High-frequency updates in this application were bottlenecked by redundant Date parsing, localization calls, and DOM lookups. Implementing a combination of lazy DOM caching and dirty checking provides a massive performance boost (reduced tick time from ~0.4ms to ~0.1ms).
**Action:** Always prefer hoisted formatters and pre-calculated state fields for variables that don't change between ticks in high-frequency loops.

## 2025-05-15 - Repository Hygiene
**Learning:** Build artifacts (dist/) and temporary verification scripts should not be included in the final submission.
**Action:** Ensure dist/ and benchmark scripts are removed before submitting.
