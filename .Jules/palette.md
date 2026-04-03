## 2025-05-15 - Improving Onboarding Keyboard Support
**Learning:** Wrapping input fields in a `<form>` element enables native 'Enter to Submit' behavior, providing a high-impact keyboard accessibility win with minimal code. Combined with `:focus-visible` styles on inputs and buttons, it significantly improves SPA navigation predictability.
**Action:** Always wrap onboarding forms in a `<form>` and utilize the `submit` event instead of individual button `click` listeners.
