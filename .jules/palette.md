## 2025-05-15 - Improving Onboarding Accessibility and Feedback
**Learning:** Global `:focus-visible` styles on universal selectors are easily suppressed by components using `outline: none`. Proper label association via `for` attributes is critical for mobile tap targets and screen readers.
**Action:** Always check for `outline: none` in existing CSS when implementing global focus indicators and ensure `for`/`id` pairs are strictly matched across the form.
