## 2026-03-30 - Initializing Bolt Journal
**Learning:** High-frequency intervals (1s) in this app repeatedly perform expensive DOM lookups and date parsing.
**Action:** Use DOM caching, pre-calculate static values (like birth day of week), and implement dirty checking to minimize main-thread impact.
