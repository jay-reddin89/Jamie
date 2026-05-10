## 2024-05-22 - Standardized Accessible Modal Pattern
**Learning:** For immersive cyberpunk themes that often use absolute/fixed overlays, basic toggle logic isn't enough for a good UX. Users expect standard "dialog" behaviors like Escape key to close and clicking the backdrop to exit. Proper ARIA roles (dialog, aria-modal) are essential when the UI is visually "locked" behind an overlay.
**Action:** Always implement 'Escape' and 'Click-outside' listeners alongside ARIA dialog roles for any modal implementation in this design system.

## 2024-05-22 - Native Validation with Visual Feedback
**Learning:** Cyberpunk interfaces can be visually dense, making it easy to miss mandatory fields. Combining HTML5 'required' attributes with explicit red '*' indicators ensures both accessibility (for screen readers) and clear visual hierarchy for all users.
**Action:** Use the '.text-error' utility for mandatory field markers to maintain consistency with the system's error color palette.
