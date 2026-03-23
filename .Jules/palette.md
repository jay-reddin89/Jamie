## 2025-05-14 - Form Accessibility and Dynamic Notifications
**Learning:** Explicitly associating labels with inputs using 'for'/'id' significantly improves hit targets and screen reader context. Dynamic toasts must use 'role="status"' and 'aria-live="polite"' to be perceived by assistive technologies.
**Action:** Always verify label association in forms and ensure ARIA live regions are used for any status notifications.
