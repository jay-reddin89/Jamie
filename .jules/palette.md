## 2025-05-15 - Improving Onboarding Accessibility and Feedback
**Learning:** Global `:focus-visible` styles on universal selectors are easily suppressed by components using `outline: none`. Proper label association via `for` attributes is critical for mobile tap targets and screen readers.
**Action:** Always check for `outline: none` in existing CSS when implementing global focus indicators and ensure `for`/`id` pairs are strictly matched across the form.

## 2025-05-22 - Visual Stability and Semantic Interactivity
**Learning:** High-frequency updates can cause horizontal "jitter" in text if glyph widths vary (e.g., '1' vs '8'). `font-variant-numeric: tabular-nums` ensures constant character widths, stabilizing the layout. Converting `div` toggles to semantic `<button>` elements provides native keyboard and screen reader support that is difficult to replicate with ARIA alone.
**Action:** Use tabular figures for any live-updating numeric displays. Always prioritize semantic buttons for interactive elements to ensure accessibility and predictable focus behavior.
