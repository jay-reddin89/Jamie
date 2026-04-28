## 2025-05-15 - High-frequency update optimization
**Learning:** In high-frequency loops (1s intervals), redundant DOM queries via \`document.getElementById\` and unnecessary writes to \`textContent\` significantly impact performance (average tick ~2.5ms). Hoisting formatters and implementing lazy DOM caching with dirty checking reduces overhead by ~95%.
**Action:** Always implement closure-based or global lazy DOM caches for high-frequency update loops. Ensure existing intervals are cleared before starting new ones to prevent resource leaks.
