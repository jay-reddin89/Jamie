## 2025-05-14 - [Interval Leak & High-Frequency Redundancy]
**Learning:** Found that the live-updating dashboard re-initialized intervals without clearing old ones, leading to memory and CPU leaks. Also, the 1-second update loop performed redundant Date parsing and DOM lookups (13 elements) every tick.
**Action:** Always store interval IDs in state and clear them before re-initializing. Cache DOM references outside the interval for any high-frequency loops (<= 1000ms).
