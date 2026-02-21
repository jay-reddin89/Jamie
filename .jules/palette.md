## 2025-02-21 - Accessible Collapsible Sections
**Learning:** Collapsible sections implemented with interactive `div` elements are inaccessible to keyboard and screen reader users. Converting them to semantic `button` elements with `aria-expanded` attributes is a high-impact, low-line-count improvement.
**Action:** Always use `<button>` for interactive headers and use a `.btn-reset` utility class to maintain visual design while improving semantics.
