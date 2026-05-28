## 2025-05-15 - [Optimization of High-Frequency Update Loops]
**Learning:** In vanilla JS applications with per-second updates, significant performance overhead comes from repeated `document.getElementById` calls and redundant DOM `textContent` assignments. Hoisting `Intl.NumberFormat` pre-instantiation and implementing "dirty checking" (comparing `textContent` before writing) reduced tick duration by ~81% (0.99ms to 0.19ms).
**Action:** Always implement lazy DOM caching and dirty checking for intervals < 2000ms. Hoist all invariant formatting and date calculations outside the loop closure.
