## 2025-05-14 - Accessible Form Patterns
**Learning:** Converting loose input groups into a semantic `<form>` with proper `<label for="...">` associations significantly improves keyboard navigation (Enter key to submit) and screen reader accessibility.
**Action:** Always wrap onboarding or data-entry fields in a `<form>` and ensure every input has a clearly associated label.

## 2025-05-14 - Multi-layered Validation
**Learning:** While HTML `required` attributes provide native browser validation, redundant JavaScript validation allows for custom-styled feedback (like toast notifications) that maintains the app's visual theme.
**Action:** Use native validation for baseline accessibility, but layer custom feedback for a more polished and consistent user experience.
