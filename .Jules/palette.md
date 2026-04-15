## 2026-04-15 - Improving Onboarding Accessibility and Validation

**Learning:** Associating labels with inputs via `for` attributes and using `reportValidity()` provides a much smoother and more accessible experience than manual validation alerts. It leverages browser-native UI which is familiar to users and handles screen reader focus correctly.

**Action:** Always ensure `for`/`id` parity in forms and prefer `reportValidity()` over simple `alert()` or custom notification logic for primary validation.
