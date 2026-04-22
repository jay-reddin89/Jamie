## 2025-05-22 - Optimized High-Frequency Updates in script.js
**Learning:** High-frequency UI updates (1Hz+) in vanilla JS can be significantly optimized by implementing centralized DOM element caching, dirty checking on text content, and hoisting heavy objects like `Intl.NumberFormat` and constant calculations out of the interval loop.
**Action:** Always use a `getCachedElement` helper and pre-instantiated formatters for high-frequency `setInterval` or `requestAnimationFrame` loops. Ensure interval leaks are prevented by tracking and clearing interval IDs in the global state.
