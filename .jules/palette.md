## 2025-05-15 - Improving Onboarding Accessibility and Feedback
**Learning:** Global `:focus-visible` styles on universal selectors are easily suppressed by components using `outline: none`. Proper label association via `for` attributes is critical for mobile tap targets and screen readers.
**Action:** Always check for `outline: none` in existing CSS when implementing global focus indicators and ensure `for`/`id` pairs are strictly matched across the form.

## 2026-05-19 - Enhancing Settings Persistence and Immediate UI Feedback
**Learning:** UX is significantly improved when user preferences (like data module toggles) are both persisted in `localStorage` and immediately reflected in the UI without requiring a page reload. Adding `autocomplete` attributes and proper ARIA roles further polishes the interaction.
**Action:** Implement a `loadSettings` pattern on initialization and ensure `apply` actions trigger immediate state-to-UI synchronization.
