## 2025-05-14 - Redundant Date Parsing and DOM Lookups in High-Frequency Loops
**Learning:** In high-frequency `setInterval` loops (like the 1s live update), repeated string-to-date parsing using `new Date(dobStr)` and repeated `document.getElementById` calls create unnecessary CPU overhead and garbage collection pressure. Pre-parsing data and using a lazy DOM cache significantly improves performance.
**Action:** Always pre-calculate derived values (like `Date` objects from strings) outside of update loops and implement a simple `domCache` for repeated element access.
