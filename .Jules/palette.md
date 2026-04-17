## 2025-05-14 - Semantic Form Accessibility
**Learning:** Using a semantic `<form>` element instead of a generic container allows for native browser behaviors like submitting with the Enter key, significantly improving keyboard UX. Additionally, explicit `for` and `id` associations between labels and inputs are essential for screen reader support and increasing the clickable area for users.
**Action:** Always wrap interactive input groups in a `<form>` and ensure every input has a corresponding `<label>` with a matching `for` attribute.
