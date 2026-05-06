## 2025-05-22 - [Stale DOM Cache Anti-pattern]
**Learning:** In applications that frequently clear and re-render their container (e.g., `container.innerHTML = ''`), global DOM caches for high-frequency updates will retain references to detached elements. This results in updates being applied to elements no longer in the document, while the new visible elements remain static.
**Action:** Always scope DOM caches locally within the function that initiates the update loop (e.g., `startLiveUpdates`), ensuring the cache is fresh for each new render cycle.
