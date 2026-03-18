## 2025-05-14 - Accessibility & Hygiene Enhancements
**Learning:** Explicit association between <label> and <input> using 'for'/'id' attributes is critical for screen readers and significantly improves the hit target size for all users, particularly on touch devices. Decorative icons (e.g., inside settings buttons) must include aria-hidden="true" to prevent redundant announcements.

**Action:** Always verify that every form field has a linked label, and mandatory fields are clearly marked with both visual (asterisk) and programmatic (required, aria-required) indicators. Ensure environment hygiene by updating .gitignore to exclude build artifacts (dist/) and log files.
