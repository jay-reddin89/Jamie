## 2025-05-15 - Improving Onboarding Accessibility and Feedback
**Learning:** Global `:focus-visible` styles on universal selectors are easily suppressed by components using `outline: none`. Proper label association via `for` attributes is critical for mobile tap targets and screen readers.
**Action:** Always check for `outline: none` in existing CSS when implementing global focus indicators and ensure `for`/`id` pairs are strictly matched across the form.

## 2025-05-16 - Accessible Collapsible Components
**Learning:** Using semantic `<button>` elements for interactive headers in dynamically generated components significantly improves screen reader and keyboard accessibility compared to `div` or `span`. Pair with `aria-expanded` and `aria-controls` to provide essential state and relationship context.
**Action:** When creating reusable UI generator functions (like `createCollapsibleSection`), always implement semantic buttons for toggles and manage unique IDs for linked content containers.
