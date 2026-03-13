## 2025-05-14 - Accessible Form Foundations
**Learning:** Explicitly associating labels with inputs using `for` and `id` attributes is not just a screen reader requirement; it significantly improves the hit target area for all users, which is vital in a mobile-first design like this one.
**Action:** Always verify label-input associations and use semantic HTML to ensure interactive elements have generous hit targets.

## 2025-05-14 - Balanced Focus Indicators
**Learning:** Using `:focus-visible` with `!important` effectively overrides inherited `outline: none` patterns from legacy CSS without cluttering the UI for mouse users.
**Action:** Implement `:focus-visible` as a standard global utility to maintain keyboard accessibility while respecting visual design constraints.
