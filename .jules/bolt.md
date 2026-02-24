## 2025-05-14 - [Backward Compatibility in Utility Refactoring]
**Learning:** When refactoring core utility functions (like `calculateAge`) for performance (e.g., changing input from string to Date), failing to maintain backward compatibility can break numerous static parts of the application that are only called once. Even small performance wins in hot paths must not break cold paths.
**Action:** Use type checking (`instanceof Date`) and default parameters to ensure refactored utilities work for all existing call sites while still providing optimized paths for high-frequency loops.
