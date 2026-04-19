## 2025-05-14 - Accessible Modal and Form Patterns
**Learning:** Combining native HTML attributes (for, required) with ARIA roles (dialog, aria-modal) and keyboard listeners (Escape key) provides a significant accessibility boost with minimal code. Using :focus-visible ensures that mouse users don't see unnecessary outlines while keyboard users get the visibility they need.
**Action:** Always pair modal implementations with an Escape key listener and proper ARIA labeling. Use the 'for' attribute on labels even if they are wrapping the input for maximum screen reader compatibility.
