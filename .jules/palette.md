## 2025-05-15 - Improving Onboarding Accessibility and Feedback
**Learning:** Global `:focus-visible` styles on universal selectors are easily suppressed by components using `outline: none`. Proper label association via `for` attributes is critical for mobile tap targets and screen readers.
**Action:** Always check for `outline: none` in existing CSS when implementing global focus indicators and ensure `for`/`id` pairs are strictly matched across the form.

## 2025-05-25 - Accessible Collapsible Sections & Tabular Numerals
**Learning:** Converting non-semantic `div` headers to `button` elements is the baseline for keyboard accessibility. Pairing them with `aria-expanded` and `aria-controls` provides essential context for screen readers. Using `font-variant-numeric: tabular-nums` is a critical micro-UX touch for live counters to prevent layout jitter.
**Action:** Always use semantic buttons for toggles and apply tabular-nums to high-frequency numerical updates to ensure visual stability.
