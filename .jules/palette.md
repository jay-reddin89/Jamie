## 2025-05-14 - Semantic Collapsible Sections
**Learning:** Using semantic `<button>` elements instead of `<div>` for interactive collapsible headers significantly improves keyboard accessibility and screen reader support by providing native focus handling and ARIA role information.
**Action:** Always use `<button>` for headers that toggle content and ensure `aria-expanded` and `aria-controls` are correctly updated.

## 2025-05-14 - Explicit Label Association
**Learning:** Explicitly associating `<label>` elements with their inputs using the `for` and `id` attributes is critical for accessibility and improves the hit area for all users.
**Action:** Ensure every form input has an associated label with a matching `id`.
