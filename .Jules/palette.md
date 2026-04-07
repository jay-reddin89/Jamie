## 2025-05-15 - Improving Form Accessibility and Keyboard Navigation

**Learning:** Wrapping input fields in a `<form>` element enables native 'Enter to Submit' behavior, which is a high-impact keyboard accessibility win with minimal code. Additionally, associating labels with inputs using `for` attributes is essential for screen readers and improves the clickable area for all users.

**Action:** Always wrap interactive input groups in a semantic `<form>` element and ensure every input has a corresponding `<label for="...">`.
